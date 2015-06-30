/**
 * Created by Administrator on 2015/6/30.
 */
var message_mgr = require('../../../util/message_mgr');
var consts = require('../../../util/consts');
var pomelo = require('pomelo');

message_mgr.handler(consts.TYPE_MSG.TYPE_MSG_GET_MISSION_AWARD, function(msg, session, next) {
    var username = msg.username;
    var mission_id = msg.mission_id;
    var res_msg = {};
    res_msg.msg_id = msg.msg_id;
    res_msg.mission_id = msg.mission_id;
    pomelo.app.get('user_wrapper').get_user(username,function(user_data){
        var result_array = pomelo.app.get('mission_wrapper').get_award(user_data,mission_id);
        if(result_array.length == 2){
            res_msg.success = result_array[0];
            pomelo.app.get('user_wrapper').save_db(username,result_array[1],function(reply){
                //  no waiting
            });
        }
        else{
            res_msg.success = 1;
        }
        next(null, res_msg);
    });
});