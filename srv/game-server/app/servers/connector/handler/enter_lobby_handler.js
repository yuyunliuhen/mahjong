/**
 * Created by Administrator on 2015/5/21.
 */
var message_mgr = require('../../../util/message_mgr');
var consts = require('../../../util/consts');
var pomelo = require('pomelo');

message_mgr.handler(consts.TYPE_MSG.TYPE_MSG_ENTER_LOBBY, function(msg, session, next) {
    //  lobby id
    var lid = msg.lid;
    var uid = msg.username + '*';
    var sessionService = pomelo.app.get('sessionService');
    if(0){
        //duplicate log in
        if( !! sessionService.getByUid(uid)) {
            next(null, {
                code: 500,
                error: true
            });
            return;
        }
    }
    session.bind(uid);
    session.set('lid', 'lid_' + lid);
    session.push('lid', function(err) {
        if(err) {
            console.error('set rid for session service failed! error is : %j', err.stack);
        }
    });
    session.on('closed', onUserLeave.bind(null, pomelo.app));
    var res_msg = {};
    res_msg.msg_id = msg.msg_id;
    //  put user into channel
    pomelo.app.rpc.lobby.lobby_remote.add(session, uid, pomelo.app.get('serverId'), session.get('lid'), true, function(users){
        //  get lobby info
        pomelo.app.rpc.lobby.lobby_remote.region_list(session, uid, pomelo.app.get('serverId'), session.get('lid'), function(region_list){
            res_msg.region_list = region_list;
            next(null, res_msg);
        });
    });
});

var onUserLeave = function(app, session) {
    if(!session || !session.uid) {
        return;
    }
    pomelo.app.rpc.lobby.lobby_remote.kick(session, session.uid, app.get('serverId'), session.get('lid'), null);
};