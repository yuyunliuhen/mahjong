/**
 * Created by Administrator on 2015/5/12.
 */
var message_mgr = require('../../../util/message_mgr');
var consts = require('../../../util/consts');
var pomelo = require('pomelo');
var user_wrapper = require('../../../user/user_wrapper');
var object_template = require('../../../object/object_template');
var async = require('async');
var uuid = require('node-uuid');
var log4js = require('log4js');
log4js.configure(require('../../../../config/log.json'));
var connector_logger = log4js.getLogger('connector-logger');

message_mgr.handler(consts.TYPE_MSG.TYPE_MSG_LOGIN, function(msg, session, next) {
    var username = msg.username;
    if(username == "test" || username == ''){
        username = uuid.v1();
    }
    var uid = username + '*';
    var sessionService = pomelo.app.get('sessionService');
    session.bind(uid);
    session.set(consts.GLOBAL_SESSION, consts.GLOBAL_SESSION);
    session.push(consts.GLOBAL_SESSION, function(err) {
        if(err) {
            console.error('set rid for session service failed! error is : %j', err.stack);
        }
    });
    session.on('closed', onUserLeave.bind(null, pomelo.app));
    var res_msg = {};
    res_msg.msg_id = msg.msg_id;
    //  put user into channel
    pomelo.app.rpc.lobby.lobby_remote.add(session, uid, pomelo.app.get('serverId'), consts.GLOBAL_SESSION, true, function(users){
        //  get user from redis, if user exists, get the user data, else create a new user and save user data to redis!
        pomelo.app.get('user_wrapper').get_user(username,function(user_data){
            var object_user = null;
            if(!user_data){
                //  user not exist, create new one
                object_user = object_template.create_object('object_user');
                object_user.init(username);
                user_data = object_user.json_2_string();
            }
            pomelo.app.rpc.lobby.lobby_remote.pack_all_lobby_simple_data(session, function(array_lobby_data){
                res_msg.user_data = user_data;
                res_msg.array_lobby_data = array_lobby_data;
                //  reset everyday mission
                user_data = pomelo.app.get('mission_wrapper').check_everyday_mission(user_data);
                user_data = pomelo.app.get('mission_wrapper').trigger(user_data,consts.MISSION_ID.MISSION_ID_LOGIN_AWARD);
                pomelo.app.get('user_wrapper').save_db(username,user_data,function(reply){
                    //  no waiting
                });
                connector_logger.debug(res_msg);
                next(null, res_msg);
            });
        });
    });
});

var onUserLeave = function(app, session) {
    if(!session || !session.uid) {
        return;
    }
    pomelo.app.rpc.lobby.lobby_remote.kick(session, session.uid, app.get('serverId'), consts.GLOBAL_SESSION, null);
};