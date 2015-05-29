/**
 * Created by Administrator on 2015/5/28.
 */
var consts = require('../util/consts');
var game_logic_wrapper = require('./game_logic_wrapper');
var game_logic_manager = function(){
    this.table_game_logic = {};
    this.tick();
};

module.exports = game_logic_manager;

game_logic_manager.prototype.start_new_game = function(tid,join_list,cb){
    var __game_logic_wrapper = new game_logic_wrapper();
    __game_logic_wrapper.start_game(join_list,cb);
    this.table_game_logic[tid] = __game_logic_wrapper;
};

game_logic_manager.prototype.tick = function(){
    var self = this;
    var interval_time = 1*1000;
    setInterval(function(){
        for(var v in self.table_game_logic){
            self.table_game_logic[v].tick();
        }
    },interval_time);
};
