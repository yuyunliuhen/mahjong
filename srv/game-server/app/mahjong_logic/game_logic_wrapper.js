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
    this.game_type = 0;
    this.game_status = 0;
    this.player_list = [];
    this.wait_time = consts.MAX_WAITING_TIME;
    this.cur_player_index = 0;
    this.cur_banker_index = 0;
    this.shuffle = null;
    this.last_card = object_template.create_object_card();
    this.last_draw_card = object_template.create_object_card();
};

module.exports = game_logic_wrapper;

game_logic_wrapper.prototype.del_player = function(username){
    for(var i = 0; i < this.player_list.length; ++i){
        if(username == this.player_list[i].get_username())
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
	this.player_list = [];
    this.shuffle.set_card_draw_num(14);
    this.shuffle.shuffle();
    joiner_list = JSON.parse(joiner_list);
    var player_card_list_hand_array = [];
    for(var i = 0; i < joiner_list.length; ++i){
        var __game_player_wrapper = new game_player_wrapper();
        __game_player_wrapper.init(joiner_list[i].username,joiner_list[i].sid,joiner_list[i].pos);
		//	test begin
		if(0 == i){
			var tmp_card = this.shuffle.get_card_specified(4,2);
			__game_player_wrapper.add_card(4,2);
			var tmp_card = this.shuffle.get_card_specified(4,2);
			__game_player_wrapper.add_card(4,2);
			var tmp_card = this.shuffle.get_card_specified(4,2);
			__game_player_wrapper.add_card(4,2);
			var tmp_card = this.shuffle.get_card_specified(2,2);
			__game_player_wrapper.add_card(2,2);
			var tmp_card = this.shuffle.get_card_specified(2,2);
			__game_player_wrapper.add_card(2,2);
			var tmp_card = this.shuffle.get_card_specified(2,2);
			__game_player_wrapper.add_card(2,2);
			var tmp_card = this.shuffle.get_card_specified(2,5);
			__game_player_wrapper.add_card(2,5);
			var tmp_card = this.shuffle.get_card_specified(2,5);
			__game_player_wrapper.add_card(2,5);
			var tmp_card = this.shuffle.get_card_specified(2,5);
			__game_player_wrapper.add_card(2,5);
			var tmp_card = this.shuffle.get_card_specified(4,5);
			__game_player_wrapper.add_card(4,5);
			var tmp_card = this.shuffle.get_card_specified(4,6);
			__game_player_wrapper.add_card(4,6);
			var tmp_card = this.shuffle.get_card_specified(3,4);
			__game_player_wrapper.add_card(3,4);
			var tmp_card = this.shuffle.get_card_specified(3,4);
			__game_player_wrapper.add_card(3,4);

			player_card_list_hand_array.push(__game_player_wrapper.pack_card_list_hand_data());
			this.player_list.push(__game_player_wrapper);
			continue;
		}
		//	test end
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
    this.show_players_card_in_hand("start_game");
    cb(JSON.stringify(player_card_list_hand_array));
    this.game_status = consts.GAME_STATUS.GAME_STATUS_FIND_BANKER;
};

game_logic_wrapper.prototype.tick = function(){
    switch(this.game_status){
        case consts.GAME_STATUS.GAME_STATUS_FIND_BANKER:{
            this.cur_player_index = Math.floor(Math.random()*this.player_list.length);
            this.cur_player_index = 0;
            this.cur_banker_index = this.cur_player_index;
            {
                this.notice_find_banker();
                this.game_status = consts.GAME_STATUS.GAME_STATUS_RUNNING;
                //  check ready hand
                if(this.check_ready_hand(this.cur_player_index)){
                    this.ready_hand_notice();
                    this.reset_wait_time();
                }
            }
            break;
        }
        case consts.GAME_STATUS.GAME_STATUS_RUNNING:{
            var end_time = 0;
            if(this.player_list[this.cur_player_index].get_hosting()){
                end_time = consts.MAX_HOSTING_END_TIME;
            }
            if(this.wait_time <= end_time){
                if(!this.player_list[this.cur_player_index].get_hosting()){
                    this.game_status = consts.GAME_STATUS.GAME_STATUS_WAITING_DISCARD;
                    this.reset_hosting_wait_time();
                }else{
                    this.notice_discard();
                    this.check_all_card();
                }
            }else{
                if(consts.MAX_WAITING_TIME >= this.wait_time){
                    this.notice_remain_time();
                }
                --this.wait_time;
            }
            break;
        }
        case consts.GAME_STATUS.GAME_STATUS_QUESTION:{
            if(this.wait_time <= 0){
                this.inc_cur_player_index();
                this.notice_draw_card();
                this.reset_wait_time();
                this.game_status = consts.GAME_STATUS.GAME_STATUS_RUNNING;
            }else{
                if(consts.MAX_WAITING_TIME >= this.wait_time){
                    this.notice_remain_time();
                }
                --this.wait_time;
            }
            break;
        }
        case consts.GAME_STATUS.GAME_STATUS_QUESTION_READY_HAND:{
            if(this.wait_time <= 0){
                this.notice_discard();
                this.inc_cur_player_index();
                this.notice_draw_card();
                this.reset_wait_time();
                this.game_status = consts.GAME_STATUS.GAME_STATUS_RUNNING;
            }else{
                if(consts.MAX_WAITING_TIME >= this.wait_time){
                    this.notice_remain_time();
                }
                --this.wait_time;
            }
            break;
        }
        case consts.GAME_STATUS.GAME_STATUS_WAITING_DISCARD:{
            if(this.wait_time <= 0){
                this.player_list[this.cur_player_index].set_hosting(1);
                this.notice_discard();
                this.check_all_card();
                this.game_status = consts.GAME_STATUS.GAME_STATUS_RUNNING;
            }else{
                --this.wait_time;
            }
            break;
        }
        case consts.GAME_STATUS.GAME_STATUS_GAME_OVER:{
            break;
        }
    }
    mahjong_logger.debug("game_status :" + this.game_status);
};

game_logic_wrapper.prototype.notice_find_banker = function(){
    var res_msg = {};
    res_msg.msg_id = consts.TYPE_NOTICE.TYPE_NOTICE_FIND_BANKER;
    var tmp_card = this.shuffle.get_new_card();
    res_msg.card_type = tmp_card.get_attr('type');
    res_msg.card_val= tmp_card.get_attr('val');
    var tmp_hole_card = this.shuffle.get_hole_card_4_kong();
    res_msg.hole_card_type = tmp_hole_card.get_attr('type');
    res_msg.hole_card_val= tmp_hole_card.get_attr('val');
    res_msg.cur_banker_index = this.cur_banker_index;
    mahjong_logger.debug("notice_find_banker!  hole_card_type:%d,hole_card_val:%d",tmp_hole_card.get_attr('type'),tmp_hole_card.get_attr('val'));
    this.set_last_draw_card(tmp_card.get_attr('type'),tmp_card.get_attr('val'));
    this.player_list[this.cur_banker_index].add_card(tmp_card.get_attr('type'),tmp_card.get_attr('val'));
    pomelo.app.rpc.lobby.lobby_remote.game_server_broadcast(null,this.get_player_names(),this.player_list[this.cur_player_index].get_sid(),res_msg,function(){
        //  do nothing
    });
};

game_logic_wrapper.prototype.notice_discard = function(obj_card,except_myself){
    var self = this;
    if(!obj_card){
        if(this.player_list[this.cur_player_index].get_ready_hand()){
            obj_card = this.last_draw_card;
        }else{
            obj_card = this.player_list[this.cur_player_index].get_end_card();
        }
    }
    this.set_last_card(obj_card.get_attr('type'),obj_card.get_attr('val'));
    var res = this.player_list[this.cur_player_index].del_card(obj_card.get_attr('type'),obj_card.get_attr('val'));
    if(!res){
        mahjong_logger.error("del_card error! %d,%d",obj_card.get_attr('type'),obj_card.get_attr('val'));
    }
    if(1) {
        mahjong_logger.debug("username %s,notice_discard obj_card %d %d, card_list_hand %j ", this.player_list[this.cur_player_index].get_username(), obj_card.get_attr('type'), obj_card.get_attr('val'), this.player_list[this.cur_player_index].get_card_list_hand());
    }
    if(0) {
        this.show_players_card_in_hand("notice_discard");
    }
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
    res_msg.remain_time = this.wait_time  - 1;
    //mahjong_logger.debug("remain_time " + res_msg.remain_time);
    pomelo.app.rpc.lobby.lobby_remote.game_server_broadcast(null,this.get_player_names(),this.player_list[this.cur_player_index].get_sid(),res_msg,function(){
        //  do nothing
    });
};

game_logic_wrapper.prototype.notice_draw_card = function () {
    var res_msg = {};
    var tmp_card = this.shuffle.get_new_card();
    if (tmp_card) {
        res_msg.msg_id = consts.TYPE_NOTICE.TYPE_NOTICE_DRAW_CARD;
        res_msg.card_type = tmp_card.get_attr('type');
        res_msg.card_val = tmp_card.get_attr('val');
        res_msg.cur_player_index = this.cur_player_index;
        this.player_list[this.cur_player_index].add_card(tmp_card.get_attr('type'), tmp_card.get_attr('val'));
        //  set last card
        this.set_last_draw_card(tmp_card.get_attr('type'), tmp_card.get_attr('val'));
        pomelo.app.rpc.lobby.lobby_remote.game_server_broadcast(null,this.get_player_names(),this.player_list[this.cur_player_index].get_sid(),res_msg,function(){
            //  do nothing
        });
        if(1) {
            mahjong_logger.debug("username %s,notice_draw_card obj_card %d %d, card_list_hand %j ", this.player_list[this.cur_player_index].get_username(), tmp_card.get_attr('type'), tmp_card.get_attr('val'), this.player_list[this.cur_player_index].get_card_list_hand());
        }
        if(0) {
            this.show_players_card_in_hand("notice_draw_card");
        }
    }
    else{
        res_msg.msg_id = consts.TYPE_NOTICE.TYPE_NOTICE_FLOW_BUREAU;
        pomelo.app.rpc.lobby.lobby_remote.game_server_broadcast(null,this.get_player_names(),this.player_list[this.cur_player_index].get_sid(),res_msg,function(){
            //  do nothing
        });
        this.game_status = consts.GAME_STATUS.GAME_STATUS_GAME_OVER;
		//	clear lobby data
		var cur_player = this.player_list[this.cur_player_index];
		pomelo.app.rpc.lobby.lobby_remote.game_over(null,cur_player.get_username(),cur_player.get_username());
    }

    //  check win
    {
        if(this.check_win(this.cur_player_index)){
            if(this.player_list[this.cur_player_index].get_ready_hand()){
                var action = consts.GAME_ACTION.GAME_ACTION_WIN + consts.GAME_ACTION.GAME_ACTION_CANCEL;
                var res_msg = {};
                res_msg.msg_id = consts.TYPE_NOTICE.TYPE_NOTICE_ACTION_QUESTION;
                res_msg.action = action;
                res_msg.card_type = this.last_draw_card.get_attr('type');
                res_msg.card_val= this.last_draw_card.get_attr('val');
                res_msg.player_index = this.cur_player_index;
                mahjong_logger.debug("check win---last card: %d,%d; %j",parseInt(this.last_draw_card.get_attr('type')),parseInt(this.last_draw_card.get_attr('val')),this.player_list[this.cur_player_index].pack_card_list_hand_data());
                pomelo.app.rpc.lobby.lobby_remote.game_server_notice(null,this.player_list[this.cur_player_index].get_username(),this.player_list[this.cur_player_index].get_sid(),res_msg,function(){
                    //  do nothing
                });
                this.game_status = consts.GAME_STATUS.GAME_STATUS_QUESTION;
                this.reset_wait_time();
                return;
            }
        }
    }

    //  check kong for myself
    var tmp_player_index = this.cur_player_index;
    if (!this.player_list[tmp_player_index].get_hosting() && this.check_kong(tmp_player_index)) {
        var action = consts.GAME_ACTION.GAME_ACTION_KONG + consts.GAME_ACTION.GAME_ACTION_CANCEL;
        if (this.check_pong(tmp_player_index)) {
            action = action + consts.GAME_ACTION.GAME_ACTION_PONG;
        }
        this.kong_notice(tmp_player_index, action,true);
        this.reset_wait_time();
        mahjong_logger.debug("check kong for myself---last draw card: %d,%d; %j", parseInt(this.last_draw_card.get_attr('type')), parseInt(this.last_draw_card.get_attr('val')), this.player_list[tmp_player_index].pack_card_list_hand_data());
    }
};

game_logic_wrapper.prototype.inc_cur_player_index = function(){
    ++this.cur_player_index;
    this.cur_player_index = this.cur_player_index %  consts.MAX_NUM_PLAYER_PER_TABLE;
    mahjong_logger.debug("inc_cur_player_index " + this.cur_player_index);
};

game_logic_wrapper.prototype.game_over = function(cb){
    cb();
};

game_logic_wrapper.prototype.discard = function(username,card_type,card_val,cb){
    var tmp_player_index = this.get_player_index_by_name(username);
    if(tmp_player_index != this.cur_player_index){
        cb(0,card_type,card_val);
        mahjong_logger.debug("discard  failed" + username + "    %d : %d",card_type,card_val);
        return;
    }
    mahjong_logger.debug("discard  success " + username + "    %d : %d",card_type,card_val);
    var __game_player = this.get_player_by_name(username);
    if(__game_player){
        var tmp_card = object_template.create_object('object_card');
        tmp_card.set_attr('type',card_type);
        tmp_card.set_attr('val',card_val);
        this.notice_discard(tmp_card,true);
        this.check_all_card();
    }
    cb(1,card_type,card_val);
};

game_logic_wrapper.prototype.lock_card_already = function(username,cb){
    var tmp_player_index = this.get_player_index_by_name(username);
    if(tmp_player_index != this.cur_player_index){
        mahjong_logger.error("lock_card_already  failed " + username);
        cb();
        return;
    }
    this.game_status = consts.GAME_STATUS.GAME_STATUS_RUNNING;
    this.notice_discard();
    this.check_all_card();
    cb();
};

game_logic_wrapper.prototype.cancel_hosting = function(username,cb){
    var tmp_player_index = this.get_player_index_by_name(username);
    this.player_list[tmp_player_index].set_hosting(0);
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
    //  check kong
    for(var i = 0; i < consts.MAX_NUM_PLAYER_PER_TABLE - 1; ++i){
        var tmp_player_index = (this.cur_player_index + 1 + i) % consts.MAX_NUM_PLAYER_PER_TABLE;
        if(!this.player_list[tmp_player_index].get_hosting() && this.check_kong(tmp_player_index)){
            var action = consts.GAME_ACTION.GAME_ACTION_KONG + consts.GAME_ACTION.GAME_ACTION_CANCEL;
            if(this.check_pong(tmp_player_index)){
                action = action + consts.GAME_ACTION.GAME_ACTION_PONG;
            }
            if(0){
                var res_msg = {};
                res_msg.msg_id = consts.TYPE_NOTICE.TYPE_NOTICE_ACTION_QUESTION;
                res_msg.action = action;
                res_msg.card_type = this.last_card.get_attr('type');
                res_msg.card_val= this.last_card.get_attr('val');
                res_msg.pong_or_kong_player_index = tmp_player_index;           //  some one who pong or kong
                res_msg.cur_player_index = this.cur_player_index;               //  some one who discard
                this.game_status = consts.GAME_STATUS.GAME_STATUS_QUESTION;
                mahjong_logger.debug("check kong---last card: %d,%d; %j",parseInt(this.last_card.get_attr('type')),parseInt(this.last_card.get_attr('val')),this.player_list[tmp_player_index].pack_card_list_hand_data());
                pomelo.app.rpc.lobby.lobby_remote.game_server_broadcast(null,this.get_player_names(),this.player_list[this.cur_player_index].get_sid(),res_msg,function(){
                    //  do nothing
                });
            }else{
                this.kong_notice(tmp_player_index,action,false);
                mahjong_logger.debug("check kong---last card: %d,%d; %j",parseInt(this.last_card.get_attr('type')),parseInt(this.last_card.get_attr('val')),this.player_list[tmp_player_index].pack_card_list_hand_data());
            }
            this.reset_wait_time();
            return;
        }
    }
    //  check pong
    for(i = 0; i < consts.MAX_NUM_PLAYER_PER_TABLE - 1; ++i){
        var tmp_player_index = (this.cur_player_index + 1 + i) % consts.MAX_NUM_PLAYER_PER_TABLE;
        if(!this.player_list[tmp_player_index].get_hosting() && this.check_pong(tmp_player_index)){
            var action = consts.GAME_ACTION.GAME_ACTION_PONG + consts.GAME_ACTION.GAME_ACTION_CANCEL;
            if(0){
                var res_msg = {};
                res_msg.msg_id = consts.TYPE_NOTICE.TYPE_NOTICE_ACTION_QUESTION;
                res_msg.action = action;
                res_msg.pong_or_kong_player_index = tmp_player_index;           //  some one who pong or kong
                res_msg.cur_player_index = this.cur_player_index;               //  some one who discard
                res_msg.card_type = parseInt(this.last_card.get_attr('type'));
                res_msg.card_val= parseInt(this.last_card.get_attr('val'));
                this.game_status = consts.GAME_STATUS.GAME_STATUS_QUESTION;
                mahjong_logger.debug("check pong---last card: %d,%d; %j",parseInt(this.last_card.get_attr('type')),parseInt(this.last_card.get_attr('val')),this.player_list[tmp_player_index].pack_card_list_hand_data());
                pomelo.app.rpc.lobby.lobby_remote.game_server_broadcast(null,this.get_player_names(),this.player_list[this.cur_player_index].get_sid(),res_msg,function(){
                    //  do nothing
                });
            }
            else{
                this.pong_notice(tmp_player_index,action);
            }
            this.reset_wait_time();
            return;
        }
    }

    this.inc_cur_player_index();
    this.notice_draw_card();
    //  check ready hand
    if( !this.player_list[this.cur_player_index].get_hosting() && this.check_ready_hand(this.cur_player_index)){
        this.ready_hand_notice();
    }
    this.reset_wait_time();
};

game_logic_wrapper.prototype.ready_hand_notice = function(){
    var action = consts.GAME_ACTION.GAME_ACTION_READY_HAND;
    var res_msg = {};
    res_msg.msg_id = consts.TYPE_NOTICE.TYPE_NOTICE_ACTION_QUESTION;
    res_msg.action = action;
    this.game_status = consts.GAME_STATUS.GAME_STATUS_QUESTION_READY_HAND;
    mahjong_logger.debug("ready_hand_notice--- %j",this.player_list[this.cur_player_index].pack_card_list_hand_data());
    pomelo.app.rpc.lobby.lobby_remote.game_server_notice(null,this.player_list[this.cur_player_index].get_username(),this.player_list[this.cur_player_index].get_sid(),res_msg,function(){
        //  do nothing
    });
};

game_logic_wrapper.prototype.kong_notice = function(tmp_player_index,action,is_myself){
    var res_msg = {};
    res_msg.msg_id = consts.TYPE_NOTICE.TYPE_NOTICE_ACTION_QUESTION;
    res_msg.action = action;
	if(is_myself){
		res_msg.card_type = parseInt(this.last_draw_card.get_attr('type'));
		res_msg.card_val= parseInt(this.last_draw_card.get_attr('val'));
	}
	else{
		res_msg.card_type = parseInt(this.last_card.get_attr('type'));
		res_msg.card_val= parseInt(this.last_card.get_attr('val'));
	}
    res_msg.pong_or_kong_player_index = tmp_player_index;           //  some one who pong or kong
    res_msg.cur_player_index = this.cur_player_index;               //  some one who discard
    this.game_status = consts.GAME_STATUS.GAME_STATUS_QUESTION;
    pomelo.app.rpc.lobby.lobby_remote.game_server_broadcast(null,this.get_player_names(),this.player_list[this.cur_player_index].get_sid(),res_msg,function(){
        //  do nothing
    });
};

game_logic_wrapper.prototype.pong_notice = function(tmp_player_index,action){
    var res_msg = {};
    res_msg.msg_id = consts.TYPE_NOTICE.TYPE_NOTICE_ACTION_QUESTION;
    res_msg.action = action;
    res_msg.pong_or_kong_player_index = tmp_player_index;           //  some one who pong or kong
    res_msg.cur_player_index = this.cur_player_index;               //  some one who discard
    res_msg.card_type = parseInt(this.last_card.get_attr('type'));
    res_msg.card_val= parseInt(this.last_card.get_attr('val'));
    this.game_status = consts.GAME_STATUS.GAME_STATUS_QUESTION;
    mahjong_logger.debug("pong notice---last card: %d,%d; %j",parseInt(this.last_card.get_attr('type')),parseInt(this.last_card.get_attr('val')),this.player_list[tmp_player_index].pack_card_list_hand_data());
    pomelo.app.rpc.lobby.lobby_remote.game_server_broadcast(null,this.get_player_names(),this.player_list[this.cur_player_index].get_sid(),res_msg,function(){
        //  do nothing
    });
};

game_logic_wrapper.prototype.reset_wait_time = function(){
    this.wait_time = consts.MAX_WAITING_TIME;
};

game_logic_wrapper.prototype.reset_hosting_wait_time = function(){
    this.wait_time = consts.MAX_HOSTING_WAITING_TIME;
};

game_logic_wrapper.prototype.leave_game = function(username,cb){
    this.del_player(username);
    cb();
};

game_logic_wrapper.prototype.check_win = function(player_index){
    return this.player_list[player_index].check_win(parseInt(this.last_draw_card.get_attr('type')),parseInt(this.last_draw_card.get_attr('val')));
};

game_logic_wrapper.prototype.check_ready_hand = function(player_index){
    return this.player_list[player_index].check_ready_hand();
};


game_logic_wrapper.prototype.get_player_index_by_name = function(username){
    for(var i = 0; i < this.player_list.length; ++i){
        if(username == this.player_list[i].get_username()){
            return this.player_list[i].get_pos();
        }
    }
    return -1;
};

game_logic_wrapper.prototype.check_kong = function(player_index){
	if(this.cur_player_index == player_index){
		return this.player_list[player_index].check_kong(parseInt(this.last_draw_card.get_attr('type')),parseInt(this.last_draw_card.get_attr('val')));
	}else{
		return this.player_list[player_index].check_kong(parseInt(this.last_card.get_attr('type')),parseInt(this.last_card.get_attr('val')));
	}
};

game_logic_wrapper.prototype.do_kong = function(player_index){
	if(this.cur_player_index == player_index){
		return this.player_list[player_index].do_kong(parseInt(this.last_draw_card.get_attr('type')),parseInt(this.last_draw_card.get_attr('val')));
	}else{
		return this.player_list[player_index].do_kong(parseInt(this.last_card.get_attr('type')),parseInt(this.last_card.get_attr('val')));
	}
};

game_logic_wrapper.prototype.do_pong = function(player_index){
    return this.player_list[player_index].do_pong(parseInt(this.last_card.get_attr('type')),parseInt(this.last_card.get_attr('val')));
};

game_logic_wrapper.prototype.check_pong = function(player_index){
    return this.player_list[player_index].check_pong(parseInt(this.last_card.get_attr('type')),parseInt(this.last_card.get_attr('val')));
};

game_logic_wrapper.prototype.action_answer = function(username,action,cb){
    mahjong_logger.debug("action_answer---username: %s,action :%d",username,action);
    var data = {};
    var __game_player = this.get_player_by_name(username);
    if(__game_player){
        if(consts.GAME_ACTION.GAME_ACTION_KONG == action){
            //	kong and kong myself
			for(var i = 0; i < consts.MAX_NUM_PLAYER_PER_TABLE; ++i){
                var tmp_player_index = (this.cur_player_index + 1 + i) % consts.MAX_NUM_PLAYER_PER_TABLE;
                if(this.check_kong(tmp_player_index)){
                    this.do_kong(tmp_player_index);

                    //  notice other player
                    var res_msg = {};
                    res_msg.msg_id = consts.TYPE_NOTICE.TYPE_NOTICE_CARD_KONG;
                    res_msg.player_index = this.get_player_index_by_name(username);
                    res_msg.card_type = parseInt(this.last_card.get_attr('type'));
                    res_msg.card_val= parseInt(this.last_card.get_attr('val'));
                    this.cur_player_index = this.get_player_index_by_name(username);

                    //  add kong card to my wall
                    data.action = action;
                    var tmp_card = this.shuffle.get_hole_card_4_kong();
                    data.kong_draw_card_type = parseInt(tmp_card.get_attr('type'));
                    data.kong_draw_card_val = parseInt(tmp_card.get_attr('val'));

                    var tmp_hole_card = this.shuffle.get_next_hole_card_4_kong();
                    res_msg.hole_card_type = parseInt(tmp_hole_card.get_attr('type'));
                    res_msg.hole_card_val= parseInt(tmp_hole_card.get_attr('val'));
                    this.player_list[this.cur_player_index].add_card(data.kong_draw_card_type,data.kong_draw_card_val);
                    this.game_status = consts.GAME_STATUS.GAME_STATUS_RUNNING;
                    this.reset_wait_time();
                    mahjong_logger.debug("add hole card: %d,%d; next hole card: %d,%d; %j",data.kong_draw_card_type,data.kong_draw_card_val,res_msg.hole_card_type,res_msg.hole_card_val,
                        this.player_list[this.cur_player_index].pack_card_list_hand_data());
                    pomelo.app.rpc.lobby.lobby_remote.game_server_broadcast(null,this.get_player_names(), this.player_list[this.cur_player_index].get_sid(),res_msg,function(){
                            //  do nothing
                        });
                    mahjong_logger.debug("kong notice***last card: %d,%d; %j",parseInt(this.last_card.get_attr('type')),parseInt(this.last_card.get_attr('val')),this.player_list[this.cur_player_index].pack_card_list_hand_data());
                    break;

                }
            }
        }else if(consts.GAME_ACTION.GAME_ACTION_PONG == action){
            for(var i = 0; i < consts.MAX_NUM_PLAYER_PER_TABLE - 1; ++i){
                var tmp_player_index = (this.cur_player_index + 1 + i) % consts.MAX_NUM_PLAYER_PER_TABLE;
                if(this.check_pong(tmp_player_index)){
                    this.do_pong(tmp_player_index);
                    //  notice other player
                    var res_msg = {};
                    res_msg.msg_id = consts.TYPE_NOTICE.TYPE_NOTICE_CARD_PONG;
                    res_msg.player_index = this.get_player_index_by_name(username);
                    res_msg.card_type = parseInt(this.last_card.get_attr('type'));
                    res_msg.card_val= parseInt(this.last_card.get_attr('val'));
                    this.cur_player_index = this.get_player_index_by_name(username);
                    this.game_status = consts.GAME_STATUS.GAME_STATUS_RUNNING;
                    this.reset_wait_time();
                    pomelo.app.rpc.lobby.lobby_remote.game_server_broadcast(null,this.get_player_names_except_myself(this.player_list[this.cur_player_index].get_username()),
                        this.player_list[this.cur_player_index].get_sid(),res_msg,function(){
                            //  do nothing
                        });
                    mahjong_logger.debug("pong notice***last card: %d,%d; %j",parseInt(this.last_card.get_attr('type')),parseInt(this.last_card.get_attr('val')),this.player_list[this.cur_player_index].pack_card_list_hand_data());
                    break;
                }
            }
        }else if(consts.GAME_ACTION.GAME_ACTION_READY_HAND == action){
            //  notice other player
            var res_msg = {};
            res_msg.msg_id = consts.TYPE_NOTICE.TYPE_NOTICE_CARD_READY_HAND;
            res_msg.player_index = this.get_player_index_by_name(username);
            res_msg.cards_win = this.player_list[res_msg.player_index].get_cards_win();
            this.player_list[res_msg.player_index].set_ready_hand();
            this.game_status = consts.GAME_STATUS.GAME_STATUS_RUNNING;
            this.reset_wait_time();
            pomelo.app.rpc.lobby.lobby_remote.game_server_broadcast(null,this.get_player_names_except_myself(this.player_list[res_msg.player_index].get_username()),
                this.player_list[res_msg.player_index].get_sid(),res_msg,function(){
                    //  do nothing
                });
        }else if(consts.GAME_ACTION.GAME_ACTION_WIN == action){
            //  notice other player
            var res_msg = {};
            res_msg.msg_id = consts.TYPE_NOTICE.TYPE_NOTICE_CARD_WIN;
            res_msg.player_index = this.get_player_index_by_name(username);
            this.game_status = consts.GAME_STATUS.GAME_STATUS_GAME_OVER;
            var player_card_list_hand_array = [];
            for(var i = 0; i < this.player_list.length; ++i){
                var __game_player_wrapper = this.player_list[i];
                player_card_list_hand_array.push(__game_player_wrapper.pack_card_list_hand_data());
            }
            res_msg.win_card_type = this.last_draw_card.get_attr('type');
            res_msg.win_card_vale = this.last_draw_card.get_attr('val');
            res_msg.player_card_list_hand_array = player_card_list_hand_array;
            this.reset_wait_time();
            pomelo.app.rpc.lobby.lobby_remote.game_server_broadcast(null,this.get_player_names(),this.player_list[res_msg.player_index].get_sid(),res_msg,function(){
                    //  do nothing
                });
        }
    }
    cb(data);
};

game_logic_wrapper.prototype.set_last_card = function(card_type,card_val){
    this.last_card.set_attr("type",card_type);
    this.last_card.set_attr("val",card_val);
};

game_logic_wrapper.prototype.set_last_draw_card = function(card_type,card_val){
    this.last_draw_card.set_attr("type",card_type);
    this.last_draw_card.set_attr("val",card_val);
};

game_logic_wrapper.prototype.show_players_card_in_hand = function(param){
    var player_card_list_hand_array = [];
    for(var i = 0; i < this.player_list.length; ++i){
        var __game_player_wrapper = this.player_list[i];
        player_card_list_hand_array.push(__game_player_wrapper.pack_card_list_hand_data());
    }
    mahjong_logger.debug("param: %s; %j",param,player_card_list_hand_array);
};

game_logic_wrapper.prototype.ready_hand_cards = function(username,cards){
    for(var i = 0; i < this.player_list.length; ++i){
        if(username == this.player_list[i].get_username())
        {
            this.player_list[i].set_ready_hand_cards(cards);
        }
    }
};