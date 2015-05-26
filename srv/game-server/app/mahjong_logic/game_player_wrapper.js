/**
 * Created by Administrator on 2015/5/25.
 */
var consts = require('../util/consts');
var object_template = require('../object_template');
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

game_player_wrapper.prototype.init = function(username,sid){
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