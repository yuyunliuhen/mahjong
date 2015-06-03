/**
 * Created by Administrator on 2015/5/20.
 */
var game_player_wrapper = require('./game_player_wrapper');
var object_template = require('../object/object_template');
var shuffle_wrapper = require('./shuffle_wrapper');
var consts = require('../util/consts');
var pomelo = require('pomelo');
var log4js = require('log4js');
log4js.configure(require('../../config/log.json'));
var mahjong_logger = log4js.getLogger('mahjong-logger');

//  one bout of mahjong
var game_logic_wrapper = function(){
    this.table_id = 0;
    this.player_num = 0;
    this.game_type = 0;
    this.game_status = 0;
    this.player_list = [];
    this.start_time = 0;
    this.last_time = 0;
    this.wait_time = consts.MAX_WAITING_TIME;
    this.cur_player_index = 0;
    this.cur_banker_index = 0;
    this.shuffle = null;
    this.last_card = object_template.create_object_card();
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
    for(var i = 0; i < this.player_list.length; ++i){
        if(useranme == this.player_list[i].get_username())
        {
            this.player_list[i].leave_game();
        }
    }
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
        __game_player_wrapper.init(joiner_list[i].username,joiner_list[i].sid,joiner_list[i].pos);
        for(var j = 0; j < consts.CARD_TOTAL_FIRST_PER_PEOPLE; ++j){
            var tmp_card = this.shuffle.get_new_card();
            __game_player_wrapper.add_card(tmp_card.get_attr('type'),tmp_card.get_attr('val'));
        }
        player_card_list_hand_array.push(__game_player_wrapper.pack_card_list_hand_data());
        this.player_list.push(__game_player_wrapper);
    }
    //  sort player_list by pos ascending order
    this.player_list.sort(function(a,b){
        if (a.get_pos() > b.get_pos())
            return 1;
        if (a.get_pos() < b.get_pos())
            return -1;
    });
    mahjong_logger.debug("start_game : player_card_list_hand_array %j ",player_card_list_hand_array);
    cb(JSON.stringify(player_card_list_hand_array));
    this.game_status = consts.GAME_STATUS.GAME_STATUS_FIND_BANKER;
};

game_logic_wrapper.prototype.tick = function(){
    switch(this.game_status){
        case consts.GAME_STATUS.GAME_STATUS_FIND_BANKER:{
            this.cur_player_index = Math.floor(Math.random()*this.player_list.length);
            this.cur_player_index = 0;
            this.cur_banker_index = this.cur_player_index;
            if(0){
                this.notice_draw_card();
            }
            else{
                this.notice_find_banker();
                this.game_status = consts.GAME_STATUS.GAME_STATUS_RUNNING;
            }
            break;
        }
        case consts.GAME_STATUS.GAME_STATUS_RUNNING:{
            if(this.wait_time <= 0){
                this.notice_discard();
                this.check_all_card();
            }else{
                if(consts.MAX_WAITING_TIME >= this.wait_time){
                    this.notice_remain_time();
                }
                --this.wait_time;
            }
            break;
        }
        case consts.GAME_STATUS.GAME_STATUS_QUESTION:{
            break;
        }
    }
};

game_logic_wrapper.prototype.notice_find_banker = function(){
    var res_msg = {};
    res_msg.msg_id = consts.TYPE_NOTICE.TYPE_NOTICE_FIND_BANKER;
    var tmp_card = this.shuffle.get_new_card();
    res_msg.card_type = tmp_card.get_attr('type');
    res_msg.card_val= tmp_card.get_attr('val');
    res_msg.cur_banker_index = this.cur_banker_index;
    pomelo.app.rpc.lobby.lobby_remote.game_server_broadcast(null,this.get_player_names(),this.player_list[this.cur_player_index].get_sid(),res_msg,function(){
        //  do nothing
    });
};

game_logic_wrapper.prototype.notice_discard = function(obj_card,except_myself){
    var self = this;
    if(!obj_card){
        obj_card = this.player_list[this.cur_player_index].get_end_card();
    }
    this.last_card.set_attr(obj_card.get_attr("type"),obj_card.get_attr("val"));
    this.player_list[this.cur_player_index].del_card(obj_card.get_attr('type'),obj_card.get_attr('val'));
    //mahjong_logger.debug("username %s,notice_discard obj_card %d %d, card_list_hand %j ", this.player_list[this.cur_player_index].get_username(),obj_card.get_attr('type'),obj_card.get_attr('val'),this.player_list[this.cur_player_index].get_card_list_hand());
    var res_msg = {};
    res_msg.msg_id = consts.TYPE_NOTICE.TYPE_NOTICE_DISCARD;
    res_msg.card_type = parseInt(obj_card.get_attr('type'));
    res_msg.card_val= parseInt(obj_card.get_attr('val'));
    res_msg.cur_player_index = this.cur_player_index;
    var broadcast_list = [];
    if(except_myself){
        broadcast_list = this.get_player_names_except_myself(this.player_list[this.cur_player_index].get_username());
    }else{
        broadcast_list = this.get_player_names()
    }
    pomelo.app.rpc.lobby.lobby_remote.game_server_broadcast(null,broadcast_list,this.player_list[this.cur_player_index].get_sid(),res_msg,function(){
        //  do nothing
    });
};

game_logic_wrapper.prototype.notice_remain_time = function(){
    var res_msg = {};
    res_msg.msg_id = consts.TYPE_NOTICE.TYPE_NOTICE_REMAIN_TIME;
    res_msg.remain_time = this.wait_time;
    pomelo.app.rpc.lobby.lobby_remote.game_server_broadcast(null,this.get_player_names(),this.player_list[this.cur_player_index].get_sid(),res_msg,function(){
        //  do nothing
    });
};

game_logic_wrapper.prototype.notice_draw_card = function(){
    var res_msg = {};
    var tmp_card = this.shuffle.get_new_card();
    if(tmp_card){
        res_msg.msg_id = consts.TYPE_NOTICE.TYPE_NOTICE_DRAW_CARD;
        res_msg.card_type = tmp_card.get_attr('type');
        res_msg.card_val= tmp_card.get_attr('val');
        res_msg.cur_player_index = this.cur_player_index;
        this.player_list[this.cur_player_index].add_card(tmp_card.get_attr('type'),tmp_card.get_attr('val'));
        pomelo.app.rpc.lobby.lobby_remote.game_server_broadcast(null,this.get_player_names(),this.player_list[this.cur_player_index].get_sid(),res_msg,function(){
            //  do nothing
        });
    }
    else{
        res_msg.msg_id = consts.TYPE_NOTICE.TYPE_NOTICE_FLOW_BUREAU;
        pomelo.app.rpc.lobby.lobby_remote.game_server_broadcast(null,this.get_player_names(),this.player_list[this.cur_player_index].get_sid(),res_msg,function(){
            //  do nothing
        });
    }
};

game_logic_wrapper.prototype.inc_cur_player_index = function(){
    ++this.cur_player_index;
    this.cur_player_index = this.cur_player_index %  consts.MAX_NUM_PLAYER_PER_TABLE;
};

game_logic_wrapper.prototype.game_over = function(cb){
    cb();
};

game_logic_wrapper.prototype.discard = function(username,card_type,card_val,cb){

    var tmp_player_index = this.get_player_index_by_name(username);
    if(tmp_player_index != this.cur_player_index){

    }
    var __game_player = this.get_player_by_name(username);
    if(__game_player){
        var tmp_card = object_template.create_object('object_card');
        tmp_card.set_attr('type',card_type);
        tmp_card.set_attr('val',card_val);
        this.notice_discard(tmp_card,true);
        this.check_all_card();
    }
    cb();
};

game_logic_wrapper.prototype.get_player_names = function(){
    var username_arr = [];
    for(var i = 0; i < this.player_list.length; ++i){
        if(1 != this.player_list[i].flag_leave){
            username_arr.push(this.player_list[i].get_username());
        }
    }
    return username_arr;
    console.log( username_arr);
};

game_logic_wrapper.prototype.get_player_names_except_myself = function(username){
    var username_arr = [];
    for(var i = 0; i < this.player_list.length; ++i){
        if(1 != this.player_list[i].flag_leave && username != this.player_list[i].get_username()){
            username_arr.push(this.player_list[i].get_username());
        }
    }
    return username_arr;
    console.log( username_arr);
};

game_logic_wrapper.prototype.get_player_by_name = function(username){
    for(var i = 0; i < this.player_list.length; ++i){
        if(username == this.player_list[i].get_username()){
            return this.player_list[i];
        }
    }
    return null;
};

game_logic_wrapper.prototype.check_all_card = function(){
    //  do something
    this.inc_cur_player_index();
    this.notice_draw_card();
    this.reset_wait_time();
};

game_logic_wrapper.prototype.reset_wait_time = function(){
    this.wait_time = consts.MAX_WAITING_TIME;
};

game_logic_wrapper.prototype.leave_game = function(username,cb){
    this.del_player(username);
    cb();
};

game_logic_wrapper.prototype.check_win = function(player_index){
    this.player_list[player_index].add_card(this.last_card.get_attr("type"),this.last_card.get_attr("val"));
};

game_logic_wrapper.prototype.get_player_index_by_name = function(username){
    for(var i = 0; i < this.player_list.length; ++i){
        if(username == this.player_list[i].get_username()){
            return this.player_list[i].get_pos();
        }
    }
    return -1;
};
