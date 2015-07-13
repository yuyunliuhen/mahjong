/**
 * Created by Administrator on 2015/7/7.
 */
var message_mgr = require('../../../util/message_mgr');
var consts = require('../../../util/consts');
var pomelo = require('pomelo');

message_mgr.handler(consts.TYPE_MSG.TYPE_MSG_READY_HAND_CARDS, function(msg, session, next) {
    var username = msg.username;
    var cards = msg.cards;
    var res_msg = {};
    res_msg.msg_id = msg.msg_id;
    pomelo.app.rpc.lobby.lobby_remote.ready_hand_cards(session, username,cards);
    next(null, res_msg);
});