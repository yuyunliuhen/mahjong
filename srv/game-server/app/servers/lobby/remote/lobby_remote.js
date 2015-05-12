var pomelo = require('pomelo');
var message_mgr = require('../../../util/message_mgr');

module.exports = function(app) {
    return new lobby_remote(app);
};

var lobby_remote = function(app) {
    this.app = app;
};

lobby_remote.prototype.message_route = function(msg,callback){
    message_mgr.trigger(msg.route_type,msg,callback );
};
