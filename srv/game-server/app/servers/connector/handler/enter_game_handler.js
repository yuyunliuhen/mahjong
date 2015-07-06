/**
 * Created by Administrator on 2015/5/21.
 */
var message_mgr = require('../../../util/message_mgr');
var consts = require('../../../util/consts');
var pomelo = require('pomelo');
var async = require('async');

message_mgr.handler(consts.TYPE_MSG.TYPE_MSG_ENTER_GAME, function(msg, session, next) {
    var lid = parseInt(msg.lid);
    var rid = parseInt(msg.rid);
    var tid = parseInt(msg.tid);
    var username = msg.username;
    var res_msg = {};
    res_msg.msg_id = msg.msg_id;
    var user_wrapper = pomelo.app.get('user_wrapper');
    pomelo.app.rpc.lobby.lobby_remote.enter_game(session, lid, rid,tid, username,pomelo.app.get('serverId'), function(joiner_data,lid,rid,tid){
        if(joiner_data){
            res_msg.joiner_data = joiner_data;
        }
        res_msg.lid = lid;
        res_msg.rid = rid;
        res_msg.tid = tid;
        var count = 0;
        async.whilst(
            function () { return count < res_msg.joiner_data.length; },
            function (callback) {
                async.waterfall([
                        function (callback) {
                            user_wrapper.get_user(res_msg.joiner_data[count][0], function (user_data) {
                                callback(null, user_data);
                            });
                        },
                        function (user_data, callback) {
                            user_data = JSON.parse(user_data);
                            res_msg.joiner_data[count].push(user_data.nickname);
                            res_msg.joiner_data[count].push(user_data.gold);
                            callback(null);
                        }
                    ],
                    // optional callback
                    function (err) {
                        if (err) {
                            console.error(err);
                        }
                        ++count;
                        callback(null);
                    });
            },
            function (err) {
                //  whilst end,do nothing
                if(err){
                    console.error(err);
                }
                next(null, res_msg);
            }
        );
    });
});
