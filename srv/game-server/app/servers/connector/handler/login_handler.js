/**
 * Created by Administrator on 2015/5/12.
 */
var message_mgr = require('../../../util/message_mgr');
var consts = require('../../../util/consts');
var pomelo = require('pomelo');
var user_wrapper = require('../../../user/user_wrapper');
var object_user = require('../../../object/object_user');
var object_template = require('../../../object/object_template');

message_mgr.handler(consts.TYPE_MSG.TYPE_MSG_LOGIN, function(msg, session, next) {
    var name = msg.name;
    var res_msg = {};
    //  get user from redis, if user exists, get the user data, else create a new user and save user data to redis!
    pomelo.app.get('user_wrapper').get_user(name,function(user_data){
        var __object_user = null;
        if(!user_data){
            //  user not exist, create new one
            __object_user = object_template.create_object('object_user');
            __object_user.init(name);
            user_data = __object_user.json_2_string();
            pomelo.app.get('user_wrapper').save_db(name,user_data,function(reply){

            });
        }
        res_msg.user_data = user_data;
        next(null, res_msg);
    });
});
