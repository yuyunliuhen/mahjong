/**
 * Created by Administrator on 2015/5/13.
 */
var message_mgr = require('../../../util/message_mgr');
var consts = require('../../../util/consts');
var pomelo = require('pomelo');

/**
 * rule of channel name:    lobby_id*room_id
 * for example: lobby1, means all of lobby1's channel;lobby1*room1, means room1 of lobby1's channel;
 *
 * rule of uid name:        username*rid
 **/
message_mgr.handler(consts.TYPE_MSG.TYPE_MSG_ENTER_ROOM, function(msg, session, next) {
    var lid = msg.lid;
    var rid = msg.rid;
    var uid = msg.username + '*';
    var sessionService = pomelo.app.get('sessionService');
    session.bind(uid);
    session.set('rid', 'lid_' + lid + '_rid_' + rid);
    session.push('rid', function(err) {
        if(err) {
            console.error('set rid for session service failed! error is : %j', err.stack);
        }
    });
    var res_msg = {};
    res_msg.msg_id = msg.msg_id;
    session.on('closed', onUserLeave.bind(null, pomelo.app));

    //  put user into channel
    pomelo.app.rpc.lobby.lobby_remote.add(session, uid, pomelo.app.get('serverId'), session.get('rid'), true, function(users){
        res_msg.users = users;
        next(null, res_msg);
    });
});

var onUserLeave = function(app, session) {
    if(!session || !session.uid) {
        return;
    }
    pomelo.app.rpc.lobby.lobby_remote.kick(session, session.uid, pomelo.app.get('serverId'), session.get('rid'), null);
};