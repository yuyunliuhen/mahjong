/**
 * Created by Administrator on 2015/5/12.
 */
var message_mgr = require('../../../util/message_mgr');
var consts = require('../../../util/consts');
message_mgr.handler(consts.TYPE_REMOTE_LOBBY.TYPE_REMOTE_LOBBY_TEST, function(msg, next) {
    console.log('test remote.');
    next({code: 200, msg: 'lobby server is ok.'});
});