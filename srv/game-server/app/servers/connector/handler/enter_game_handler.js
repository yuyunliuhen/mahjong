/**
 * Created by Administrator on 2015/5/21.
 */
var message_mgr = require('../../../util/message_mgr');
var consts = require('../../../util/consts');
var pomelo = require('pomelo');

message_mgr.handler(consts.TYPE_MSG.TYPE_MSG_ENTER_GAME, function(msg, session, next) {
    var lid = parseInt(msg.lid);
    var rid = parseInt(msg.rid);
    var tid = parseInt(msg.tid);
    var username = msg.username;
    var res_msg = {};
    res_msg.msg_id = msg.msg_id;
    pomelo.app.rpc.lobby.lobby_remote.enter_game(session, lid, rid,tid, username,pomelo.app.get('serverId'), function(joiner_data,lid,rid,tid){
        if(joiner_data){
            res_msg.joiner_data = joiner_data;
        }
        res_msg.lid = lid;
        res_msg.rid = rid;
        res_msg.tid = tid;
        console.log(res_msg);
        next(null, res_msg);
    });
});
