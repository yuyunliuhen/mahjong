/**
 * Created by Administrator on 2015/5/22.
 */
var message_mgr = require('../../../util/message_mgr');
var consts = require('../../../util/consts');
var pomelo = require('pomelo');

message_mgr.handler(consts.TYPE_MSG.TYPE_MSG_LEAVE_ROOM, function(msg, session, next) {
    //  lobby id
    var lid = msg.lid;
    var rid = msg.rid;
    var uid = msg.username + '*';
    pomelo.app.rpc.lobby.lobby_remote.leave_room(session, lid, rid, msg.username, null);
    var res_msg = {};
    res_msg.msg_id = msg.msg_id;
    next(null, res_msg);
});