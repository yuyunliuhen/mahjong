/**
 * Created by Administrator on 2015/5/13.
 */
var message_mgr = require('../../../util/message_mgr');
var consts = require('../../../util/consts');
var pomelo = require('pomelo');
var user_wrapper = require('../../../nosql/user_wrapper');

message_mgr.handler(consts.TYPE_MSG.TYPE_MSG_ENTER_ROOM, function(msg, session, next) {
    var rid = msg.rid;
    var name = msg.name;
    var uid = msg.name + '*' + rid;
    var sessionService = pomelo.app.get('sessionService');
    //duplicate log in
    if( !! sessionService.getByUid(uid)) {
        next(null, {
            code: 500,
            error: true
        });
        return;
    }
    session.bind(uid);
    session.set('rid', rid);
    session.push('rid', function(err) {
        if(err) {
            console.error('set rid for session service failed! error is : %j', err.stack);
        }
    });
    session.on('closed', onUserLeave.bind(null, pomelo.app));

    //  put user into channel
    pomelo.app.rpc.lobby.lobby_remote.add(session, uid, pomelo.app.get('serverId'), rid, true, function(users){
        next(null, {
            users:users
        });
    });
});

var onUserLeave = function(app, session) {
    if(!session || !session.uid) {
        return;
    }
    pomelo.app.rpc.lobby.lobby_remote.kick(session, session.uid, app.get('serverId'), session.get('rid'), null);
};