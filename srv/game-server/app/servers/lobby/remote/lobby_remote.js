var pomelo = require('pomelo');
var message_mgr = require('../../../util/message_mgr');
var consts = require('../../../util/consts');

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

lobby_remote.prototype.region_list = function(uid, sid, name, cb) {
    var lobby_manager = pomelo.app.get('lobby_manager');
    var lid = parseInt(name.split('_')[1]);
    cb(lobby_manager.get_region_list(lid));
};

lobby_remote.prototype.enter_game = function(lid,rid,username,sid,cb) {
    var lobby_manager = pomelo.app.get('lobby_manager');
    lobby_manager.enter_game(lid,rid,username,sid,cb);
};

lobby_remote.prototype.pack_all_lobby_simple_data = function(cb) {
    var lobby_manager = pomelo.app.get('lobby_manager');
    cb(JSON.stringify(lobby_manager.pack_all_lobby_simple_data()));
};