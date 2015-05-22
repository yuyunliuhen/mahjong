/**
 * Created by Administrator on 2015/5/21.
 */
var message_mgr = require('../../../util/message_mgr');
var consts = require('../../../util/consts');
var pomelo = require('pomelo');

message_mgr.handler(consts.TYPE_MSG.TYPE_MSG_ENTER_GAME, function(msg, session, next) {
    var lid = msg.lid;
    var rid = msg.rid;
    var username = msg.username;
    var res_msg = {};
    res_msg.msg_id = msg.msg_id;
    pomelo.app.rpc.lobby.lobby_remote.enter_game(session, lid, rid, username,pomelo.app.get('serverId'), function(success){
        res_msg.success = success;
        next(null, res_msg);
    });
});
