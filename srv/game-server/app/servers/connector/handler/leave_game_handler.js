/**
 * Created by Administrator on 2015/7/3.
 */
var message_mgr = require('../../../util/message_mgr');
var consts = require('../../../util/consts');
var pomelo = require('pomelo');

message_mgr.handler(consts.TYPE_MSG.TYPE_MSG_LEAVE_GAME, function(msg, session, next) {
    var username = msg.username;
    var res_msg = {};
    res_msg.msg_id = msg.msg_id;
    var uid = username + '*';
    pomelo.app.rpc.lobby.lobby_remote.leave_game(session, session.uid, pomelo.app.get('serverId'),function(){
        next(null, res_msg);
    });
});