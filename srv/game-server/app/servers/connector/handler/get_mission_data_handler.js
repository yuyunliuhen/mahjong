/**
 * Created by Administrator on 2015/6/30.
 */
var message_mgr = require('../../../util/message_mgr');
var consts = require('../../../util/consts');
var pomelo = require('pomelo');

message_mgr.handler(consts.TYPE_MSG.TYPE_MSG_GET_MISSION_DATA, function(msg, session, next) {
    var username = msg.username;
    var res_msg = {};
    res_msg.msg_id = msg.msg_id;
    pomelo.app.get('user_wrapper').get_user(username,function(user_data){
        if(user_data){
            var json_user_data = JSON.parse(user_data);
            res_msg.mission_data = JSON.stringify(json_user_data.mission_data);
        }
        next(null, res_msg);
    });
});