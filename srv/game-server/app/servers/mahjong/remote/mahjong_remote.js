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

mahjong_remote.prototype.start_game = function(tid,join_list,cb){
    pomelo.app.get('game_logic_manager').start_new_game(tid,join_list,cb);
};

mahjong_remote.prototype.game_over = function(tid,cb) {
    pomelo.app.get('game_logic_manager').game_over(tid,cb);
};

mahjong_remote.prototype.discard = function(username,tid,card_type,card_val,cb) {
    pomelo.app.get('game_logic_manager').discard(username,tid,card_type,card_val,cb);
};

mahjong_remote.prototype.leave_game = function(username,tid,cb){
    pomelo.app.get('game_logic_manager').leave_game(username,tid,cb);
};