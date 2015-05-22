/**
 * Created by Administrator on 2015/5/20.
 */
var message_mgr = require('../../../util/message_mgr');
var consts = require('../../../util/consts');
var json_pay_gold = require('../../../../config/pay_gold');

message_mgr.handler(consts.TYPE_MSG.TYPE_MSG_GET_CHARGE_LIST, function(msg, session, next) {
    var res_msg = {};
    res_msg.msg_id = msg.msg_id;
    res_msg.pay_gold = json_pay_gold;
    next(null, res_msg);
});