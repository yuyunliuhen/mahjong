var pomelo = require('pomelo');
var message_mgr = require('../../../util/message_mgr');

module.exports = function(app) {
    return new lobby_remote(app);
};

var lobby_remote = function(app) {
    this.app = app;
    this.channelService = app.get('channelService');
};

lobby_remote.prototype.message_route = function(msg,callback){
    message_mgr.trigger(msg.route_type,msg,callback );
};

lobby_remote.prototype.add = function(uid, sid, name, flag, cb) {
    var channel = this.channelService.getChannel(name, flag);
    var username = uid.split('*')[0];
    var param = {
        route: 'onAdd',
        user: username
    };
    channel.pushMessage(param);
    if( !! channel) {
        channel.add(uid, sid);
    }
    cb(this.get(name, flag));
};

lobby_remote.prototype.get = function(name, flag) {
    var users = [];
    var channel = this.channelService.getChannel(name, flag);
    if( !! channel) {
        users = channel.getMembers();
    }
    for(var i = 0; i < users.length; i++) {
        users[i] = users[i].split('*')[0];
    }
    return users;
};

lobby_remote.prototype.kick = function(uid, sid, name, cb) {
    var channel = this.channelService.getChannel(name, false);
    // leave channel
    if( !! channel) {
        channel.leave(uid, sid);
    }
    var username = uid.split('*')[0];
    var param = {
        route: 'onLeave',
        user: username
    };
    channel.pushMessage(param);
    cb();
};