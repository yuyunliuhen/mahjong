/**
 * Created by Administrator on 2015/5/12.
 */
var message_mgr = require('../../../util/message_mgr');
var consts = require('../../../util/consts');
var pomelo = require('pomelo');
var user_wrapper = require('../../../nosql/user_wrapper');

message_mgr.handler(consts.TYPE_MSG.TYPE_MSG_LOGIN, function(msg, session, next) {
    var name = msg.name;
    var pwd = msg.pwd;
    var res_msg = {};
    user_wrapper.get_user(name,function(reply){
        if(pwd == reply){
            res_msg.login_status = 1;
        }else{
            res_msg.login_status = 0;
        }
        next(null, res_msg);
    });
});
