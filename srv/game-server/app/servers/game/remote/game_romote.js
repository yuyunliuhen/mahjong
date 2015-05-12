var pomelo = require('pomelo');
var message_mgr = require('../../../util/message_mgr');

module.exports = function(app) {
    return new game_remote(app);
};

var game_remote = function(app) {
    this.app = app;
};

game_remote.prototype.message_route = function(msg,callback){
    message_mgr.trigger(/*msg.route_type*/msg.msg_id,msg,null,callback );
    return true;
};
