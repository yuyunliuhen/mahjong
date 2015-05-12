/**
 * Created by Administrator on 2015/5/12.
 */
var message_mgr = require('../../../util/message_mgr');
var consts = require('../../../util/consts');
var pomelo = require('pomelo');

message_mgr.handler(consts.TYPE_MSG.TYPE_MSG_TEST, function(msg, session, next) {
    console.log('test handler.');
    if(0){
        next(null, {code: 200, msg: 'connector server is ok.'});
    }else{
        var msg = {route_type:consts.TYPE_REMOTE_LOBBY.TYPE_REMOTE_LOBBY_TEST};
        pomelo.app.rpc.lobby.lobby_remote.message_route(session,msg,function(res_msg){
            next(null,res_msg);
        });
    }

});