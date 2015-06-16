/**
 * Created by Administrator on 2015/5/29.
 */
var message_mgr = require('../../../util/message_mgr');
var consts = require('../../../util/consts');
var pomelo = require('pomelo');

message_mgr.handler(consts.TYPE_MSG.TYPE_MSG_DISCARD, function(msg, session, next) {
    var username = msg.username;
    var card_type = msg.card_type;
    var card_val = msg.card_val;
    var res_msg = {};
    res_msg.msg_id = msg.msg_id;
    pomelo.app.rpc.lobby.lobby_remote.discard(session, username,card_type,card_val,pomelo.app.get('serverId'), function(result,card_type,card_val){
        res_msg.result = result;
        res_msg.card_type = card_type;
        res_msg.card_val = card_val;
        next(null, res_msg);
    });
});