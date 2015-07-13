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

mahjong_remote.prototype.lock_card_already = function(username,tid,cb) {
    pomelo.app.get('game_logic_manager').lock_card_already(username,tid,cb);
};

mahjong_remote.prototype.cancel_hosting = function(username,tid,cb) {
    pomelo.app.get('game_logic_manager').cancel_hosting(username,tid,cb);
};

mahjong_remote.prototype.leave_game = function(username,tid,cb){
    pomelo.app.get('game_logic_manager').leave_game(username,tid,cb);
};

mahjong_remote.prototype.action_answer = function(username,tid,action,cb) {
    pomelo.app.get('game_logic_manager').action_answer(username,tid,action,cb);
};

mahjong_remote.prototype.ready_hand_cards = function(username,tid,cards) {
    pomelo.app.get('game_logic_manager').ready_hand_cards(username,tid,cards);
};