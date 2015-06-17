/**
 * Created by Administrator on 2015/6/17.
 */
var message_mgr = require('../../../util/message_mgr');
var consts = require('../../../util/consts');
var pomelo = require('pomelo');

message_mgr.handler(consts.TYPE_MSG.TYPE_MSG_CANCEL_HOSTING, function(msg, session, next) {
    var username = msg.username;
    var res_msg = {};
    res_msg.msg_id = msg.msg_id;
    pomelo.app.rpc.lobby.lobby_remote.cancel_hosting(session, username,pomelo.app.get('serverId'), function(){
        next(null, res_msg);
    });
});