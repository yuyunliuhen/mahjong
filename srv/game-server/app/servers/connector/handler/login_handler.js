/**
 * Created by Administrator on 2015/5/12.
 */
var message_mgr = require('../../../util/message_mgr');
var consts = require('../../../util/consts');
var pomelo = require('pomelo');
var user_wrapper = require('../../../user/user_wrapper');
var object_template = require('../../../object/object_template');
var json_lobby_list = require('../../../../config/lobby_list');

message_mgr.handler(consts.TYPE_MSG.TYPE_MSG_LOGIN, function(msg, session, next) {
    var username = msg.username;
    var res_msg = {};
    res_msg.msg_id = msg.msg_id;
    //  get user from redis, if user exists, get the user data, else create a new user and save user data to redis!
    pomelo.app.get('user_wrapper').get_user(username,function(user_data){
        var object_user = null;
        if(!user_data){
            //  user not exist, create new one
            object_user = object_template.create_object('object_user');
            object_user.init(username);
            user_data = object_user.json_2_string();
            pomelo.app.get('user_wrapper').save_db(username,user_data,function(reply){

            });
        }
        res_msg.user_data = user_data;
        res_msg.lobby_list = json_lobby_list;
        next(null, res_msg);
    });
});
