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

game_logic_manager.prototype.game_over = function(tid,cb){
    for(var v in this.table_game_logic){
        if(v == tid){
            delete this.table_game_logic[v];
        }
    }
    cb();
};

game_logic_manager.prototype.discard = function(username,tid,card_type,card_val,cb){
    for(var v in this.table_game_logic){
        if(v == tid){
            this.table_game_logic[v].discard(username,card_type,card_val,cb);
        }
    }
};

game_logic_manager.prototype.lock_card_already = function(username,tid,cb){
    for(var v in this.table_game_logic){
        if(v == tid){
            this.table_game_logic[v].lock_card_already(username,cb);
        }
    }
};

game_logic_manager.prototype.cancel_hosting = function(username,tid,cb){
    for(var v in this.table_game_logic){
        if(v == tid){
            this.table_game_logic[v].cancel_hosting(username,cb);
        }
    }
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

game_logic_manager.prototype.leave_game = function(username,tid,cb){
    for(var v in this.table_game_logic){
        if(v == tid){
            this.table_game_logic[v].leave_game(username,cb);
        }
    }
};

game_logic_manager.prototype.action_answer = function(username,tid,action,cb){
    for(var v in this.table_game_logic){
        if(v == tid){
            this.table_game_logic[v].action_answer(username,action,cb);
        }
    }
};

game_logic_manager.prototype.ready_hand_cards = function(username,tid,cards){
    for(var v in this.table_game_logic){
        if(v == tid){
            this.table_game_logic[v].ready_hand_cards(username,cards);
        }
    }
};