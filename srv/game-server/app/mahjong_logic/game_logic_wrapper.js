/**
 * Created by Administrator on 2015/5/20.
 */
var game_player_wrapper = require('./game_player_wrapper');
var shuffle_wrapper = require('./shuffle_wrapper');
var consts = require('../util/consts');
var pomelo = require('pomelo');
//  one bout of mahjong
var game_logic_wrapper = function(){
    this.table_id = 0;
    this.player_num = 0;
    this.game_type = 0;
    this.game_status = 0;
    this.player_list = [];
    this.start_time = 0;
    this.last_time = 0;
    this.wait_time = 0;
    this.shuffle = null;
};

module.exports = game_logic_wrapper;

/**
 * set room of table' s id
 * @param table_id
 */
game_logic_wrapper.prototype.set_table_id = function(table_id){
    this.table_id = table_id;
};

/**
 * get room of table' s id
 */
game_logic_wrapper.prototype.get_table_id = function(){
    this.table_id = table_id;
};

game_logic_wrapper.prototype.add_player = function(useranme){

};

game_logic_wrapper.prototype.del_player = function(useranme){

};

game_logic_wrapper.prototype.get_player_count = function(){
    return player_list.length;
};

game_logic_wrapper.prototype.start_game = function(joiner_list,cb){
    this.shuffle = new shuffle_wrapper();
    this.shuffle.set_card_draw_num(14);
    this.shuffle.shuffle();
    joiner_list = JSON.parse(joiner_list);
    var player_card_list_hand_array = [];
    for(var i = 0; i < joiner_list.length; ++i){
        var __game_player_wrapper = new game_player_wrapper();
        __game_player_wrapper.init(joiner_list[i].username,joiner_list[i].sid);
        for(var j = 0; j < consts.CARD_TOTAL_FIRST_PER_PEOPLE; ++j){
            var tmp_card = this.shuffle.get_new_card();
            __game_player_wrapper.add_card(tmp_card.get_attr('type'),tmp_card.get_attr('val'));
        }
        player_card_list_hand_array.push(__game_player_wrapper.pack_card_list_hand_data());
        this.player_list.push(__game_player_wrapper);
    }
    cb(JSON.stringify(player_card_list_hand_array));
    this.game_status = consts.GAME_STATUS.GAME_STATUS_FIND_BANKER;
};

game_logic_wrapper.prototype.tick = function(){
    switch(this.game_status){
        case consts.GAME_STATUS.GAME_STATUS_FIND_BANKER:{
            var tmp_player_index = Math.floor(Math.random()*this.player_list.length);
            var res_msg = {};
            res_msg.msg_id = consts.TYPE_NOTICE.TYPE_NOTICE_FIND_BANKER;
            var tmp_card = this.shuffle.get_new_card();
            res_msg.card_type = tmp_card.get_attr('type');
            res_msg.card_val= tmp_card.get_attr('val');
            this.game_status = consts.GAME_STATUS.GAME_STATUS_RUNNING;
            pomelo.app.rpc.lobby.lobby_remote.game_server_notice(null,this.player_list[tmp_player_index].get_username(),this.player_list[tmp_player_index].get_sid(),res_msg,function(){

            });
            break;
        }
        case consts.GAME_STATUS.GAME_STATUS_RUNNING:{
            break;
        }
        case consts.GAME_STATUS.GAME_STATUS_QUESTION:{
            break;
        }
    }
};
