var pomelo = require('pomelo');

module.exports = function(app) {
    return new mahjong_remote(app);
};

var mahjong_remote = function(app) {
    this.app = app;
};

mahjong_remote.prototype.test = function(msg,cb){
    console.log("%j",msg);
    cb();
};

mahjong_remote.prototype.start_game = function(join_list,cb){
    pomelo.app.get('game_login_wrapper').start_game(join_list,cb);
};
