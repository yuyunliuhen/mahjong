/**
 * Created by Administrator on 2015/5/25.
 */
var consts = require('../util/consts');
var object_template = require('../object/object_template');
var game_player_wrapper = function(){
    this.status = 0;
};

module.exports = game_player_wrapper;

game_player_wrapper.prototype.create_multi_array = function(){
    var array_multi = new Array(consts.CARD_TYPE_MAX);
    for(var i = 0; i < array_multi.length; ++i){
        array_multi[i] = new Array();
    }
    return array_multi;
};

game_player_wrapper.prototype.init = function(username,sid,pos){
    this.username = username;
    this.sid = sid;
    this.uid = username + '*';
    this.card_list_hand = this.create_multi_array();
    this.card_list_chow = this.create_multi_array();
    this.card_list_kong = this.create_multi_array();
    this.card_list_pong = this.create_multi_array();
    this.card_last = object_template.create_object_card();
    this.win_title = "";
    this.win_multiple = 0;
    this.flag_9lbd = false;
    this.flag_13y = false;
    this.card_group_chow = [];
    this.card_group_pong = [];
    this.card_group_kong = [];
    //  13 cards
    this.card_in_hand = [];
    this.flag_leave = 0;
    this.pos = pos;
};

game_player_wrapper.prototype.get_username = function(){
    return this.username;
};

game_player_wrapper.prototype.get_sid = function(){
    return this.sid;
};

game_player_wrapper.prototype.get_uid = function(){
    return this.uid;
};

game_player_wrapper.prototype.add_card = function(card_type,card_val){
    var cards_num = this.card_list_hand[card_type].length;
    var __object_card = object_template.create_object_card();
    __object_card.set_attr('type',card_type);
    __object_card.set_attr('val',card_val);
    var find = false;
    for(var i = 0; i < cards_num; ++i){
        if(card_val < this.card_list_hand[card_type][i]){
            //  insert
            this.card_list_hand[card_type].splice(i,0,__object_card);
            find = true;
        }
    }
    if(!find){
        this.card_list_hand[card_type].push(__object_card);
    }
    this.card_last.set_attr('type',card_type);
    this.card_last.set_attr('val',card_val);
};

game_player_wrapper.prototype.del_card = function(card_type,card_val){
    for(var i = 0; i < consts.CARD_TYPE_MAX; ++i){
        for(var j = 0; j < this.card_list_hand[i].length; ++j){
            if(card_type == this.card_list_hand[i][j].get_attr('type') && card_val == this.card_list_hand[i][j].get_attr('val')){
                this.card_list_hand[i].splice(j,1);
            }
        }
    }
};

game_player_wrapper.prototype.clean_up = function(card_index){
    for(var i = 0; i < consts.CARD_TYPE_MAX; ++i){
        for(var j = 0; j < this.card_list_hand[i].length; ++j){
            delete this.card_list_hand[i][j];
            delete this.card_list_chow[i][j];
            delete this.card_list_kong[i][j];
            delete this.card_list_pong[i][j];
        }
        delete this.card_list_hand[i];
        delete this.card_list_chow[i];
        delete this.card_list_kong[i];
        delete this.card_list_pong[i];
    }
};

game_player_wrapper.prototype.pack_card_list_hand_data = function(){
    var card_list_hand_data = [];
    for(var i = 0; i < this.card_list_hand.length; ++i){
        for(var j = 0; j < this.card_list_hand[i].length; ++j){
            var tmp_object_card = this.card_list_hand[i][j];
           if(tmp_object_card){
               card_list_hand_data.push([tmp_object_card.get_attr('type'),tmp_object_card.get_attr('val')]);
           }
        }
    }
    var data = {
        uid:this.uid,
        sid:this.sid,
        card_list_hand:card_list_hand_data
    };
    return data;
};

game_player_wrapper.prototype.get_end_card = function(){
    for(var i = consts.CARD_TYPE_MAX - 1; i >= 0 ; --i){
        if(this.card_list_hand[i].length){
            return this.card_list_hand[i][this.card_list_hand[i].length - 1];
        }
    }
    return this.card_last;
};

game_player_wrapper.prototype.leave_game = function(){
    this.flag_leave = 1;
};

game_player_wrapper.prototype.get_pos = function(){
    return this.pos;
};

/**
 *
 * @param is_draw_card: draw card (true) or discard(false)
 */
game_player_wrapper.prototype.check_win = function(is_draw_card){
    if(is_draw_card){

    }
};

game_player_wrapper.prototype.is_grand_4_happiness = function(){

};

game_player_wrapper.prototype.get_card_list_hand = function(){
    return this.pack_card_list_hand_data();
};