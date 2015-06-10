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
    this.flag_ready_hand = 0;
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
        if(card_val < this.card_list_hand[card_type][i].get_attr('val')){
            //  insert
            this.card_list_hand[card_type].splice(i,0,__object_card);
            find = true;
            break
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
                return true;
            }
        }
    }
    return false;
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

game_player_wrapper.prototype.ready_hand = function(){
    this.flag_ready_hand = 1;
};

game_player_wrapper.prototype.get_pos = function(){
    return this.pos;
};

game_player_wrapper.prototype.get_card_list_hand = function(){
    return this.pack_card_list_hand_data();
};

game_player_wrapper.prototype.check_kong = function(card_type,card_val){
    this.card_group_kong = [];
    var card_list_kong_length = this.card_list_hand[card_type].length;
    if(card_list_kong_length != 0){
        if(card_list_kong_length >= 3){
            for(var i = 0; i < card_list_kong_length - 2; ++i){
                if(this.card_list_hand[card_type][i] == card_val && this.card_list_hand[card_type][i + 1] == card_val && this.card_list_hand[card_type][i + 2] == card_val){
                    var __object_card = object_template.create_object_card();
                    __object_card.set_attr('type',card_type);
                    __object_card.set_attr('val',card_val);
                    this.card_group_kong.push(__object_card);
                    break;
                }
            }
        }
    }
    if(this.card_group_kong.length > 0){
        return true;
    }
    return false;
};

game_player_wrapper.prototype.do_kong = function(card_type,card_val){
    this.add_card(card_type,card_val);
    for(var i = 0; i < this.card_group_kong.length; ++i){
        this.del_card(card_type,card_val);
        this.del_card(card_type,card_val);
        this.del_card(card_type,card_val);
        this.del_card(card_type,card_val);
    }
    for(var j = 0; j < consts.MAX_NUM_CARD_KONG; ++j){
        var __object_card = this.create_card(card_type,card_val);
        if(__object_card){
            this.card_list_kong[card_type].push(__object_card);
        }
    }
};

game_player_wrapper.prototype.check_pong = function(card_type,card_val){
    this.card_group_pong = [];
    var card_list_kong_length = this.card_list_hand[card_type].length;
    if(card_list_kong_length != 0){
        if(card_list_kong_length >= 2){
            for(var i = 0; i < card_list_kong_length - 1; ++i){
                if(this.card_list_hand[card_type][i].get_attr('val') == card_val && this.card_list_hand[card_type][i + 1].get_attr('val') == card_val){
                    var __object_card = object_template.create_object_card();
                    __object_card.set_attr('type',card_type);
                    __object_card.set_attr('val',card_val);
                    this.card_group_pong.push(__object_card);
                    break;
                }
            }
        }
    }
    if(this.card_group_pong.length > 0){
        return true;
    }
    return false;
};

game_player_wrapper.prototype.do_pong = function(card_type,card_val){
    this.add_card(card_type,card_val);
    for(var i = 0; i < this.card_group_pong.length; ++i){
        this.del_card(card_type,card_val);
        this.del_card(card_type,card_val);
        this.del_card(card_type,card_val);
    }
    for(var j = 0; j < consts.MAX_NUM_CARD_PONG; ++j){
        var __object_card = this.create_card(card_type,card_val);
        if(__object_card){
            this.card_list_kong[card_type].push(__object_card);
        }
    }
};

game_player_wrapper.prototype.check_win = function(card_type,card_val){
    this.add_card(card_type,card_val);
    var res = this.check_win_actually(true);
    this.del_card(card_type,card_val);
    return res;
};

/**
 *
 * @param is_draw_card: draw card (true) or discard(false)
 */
game_player_wrapper.prototype.check_win_actually = function(is_draw_card){
    if(is_draw_card){
        if(this.is_common_hand()){
            this.win_title = "common hand";
            this.win_multiple = 1;
            return true;
        }
        else if(this.is_grand_4_happiness()){
            this.win_title = "grand 4 happiness";
            this.win_multiple = 88;
            return true;
        }else if(this.is_grand_3_chiefs()){
            this.win_title = "grand 3 chiefs";
            this.win_multiple = 88;
            return true;
        }

    }else{
        return this.check_ready_hand();
    }
};

game_player_wrapper.prototype.check_ready_hand = function(){
    var result = false;
    for(var m = this.get_card_count() - 1; m > 0 ; --m){
        var obj_card = this.get_card_by_index(m);
        if(obj_card){
            var card_type = obj_card.get_attr("type");
            var card_val = obj_card.get_attr("val");
            this.del_card(card_type,card_val);
            if(this.check_ready_hand_actually()){
                this.add_card(card_type,card_val);
                result = true;
                if(this.flag_ready_hand == 0){
                    this.ready_hand();
                }else{
                    result = false;
                }
                break;
            }
            this.add_card(card_type,card_val);
        }
    }
    return result;
};

game_player_wrapper.prototype.check_ready_hand_actually = function(){
    var result = false;
    for(var i = 0; i < consts.CARD_DRAGON_MAX_NUM; ++i){
        this.add_card(consts.CARD_TYPE.CARD_TYPE_DRAGON,i + 1);
        if(this.check_win_actually(true)){
            result = true;
        }
        this.del_card(consts.CARD_TYPE.CARD_TYPE_DRAGON,i + 1);
    }
    for(i = 0; i < consts.CARD_WIND_MAX_NUM; ++i){
        this.add_card(consts.CARD_TYPE.CARD_TYPE_WIND,i + 1);
        if(this.check_win_actually(true)){
            result = true;
        }
        this.del_card(consts.CARD_TYPE.CARD_TYPE_WIND,i + 1);
    }

    for(i = 2; i < consts.CARD_TYPE.CARD_TYPE_MAX; ++i){
        for(var j = 0; j < consts.CARD_CHARACTER_MAX_NUM; ++j){
            this.add_card(i,j + 1);
            if(this.check_win_actually(true)){
                result = true;
            }
            this.del_card(i,j + 1);
            if(result){
                break;
            }
        }
    }
    return result;
};

game_player_wrapper.prototype.is_common_hand = function () {
    var card_pairs = 0;
    var length = this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON].length;
    if (length) {
        if (2 == length) {
            if (!this.check_cards_aa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][0].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][1].get_attr('val')))) {
                return false;
            } else {
                ++card_pairs;
            }
        } else if (3 == length) {
            if (!this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][0].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][1].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][2].get_attr('val')))) {
                return false;
            }
        } else if (5 == length) {
            if (this.check_cards_aa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][0].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][1].get_attr('val'))) &&
                this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][2].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][3].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][4].get_attr('val')))) {
                ++card_pairs;
            }else if(this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][0].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][1].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][2].get_attr('val'))) &&
                this.check_cards_aa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][3].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][4].get_attr('val')))){
                ++card_pairs;
            }else{
                return false;
            }
        }else if (8 == length){
            if (this.check_cards_aa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][0].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][1].get_attr('val'))) &&
                this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][2].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][3].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][4].get_attr('val'))) &&
                this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][5].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][6].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][7].get_attr('val')))) {
                ++card_pairs;
            }else if(this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][0].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][1].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][2].get_attr('val'))) &&
                this.check_cards_aa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][3].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][4].get_attr('val'))) &&
                this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][5].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][6].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][7].get_attr('val')))){
                ++card_pairs;
            }else if(this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][0].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][1].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][2].get_attr('val'))) &&
                this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][3].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][4].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][5].get_attr('val'))) &&
                this.check_cards_aa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][6].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][7].get_attr('val')))){
                ++card_pairs;
            }else{
                return false;
            }
        }else if (11 == length){
            if (this.check_cards_aa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][0].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][1].get_attr('val'))) &&
                this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][2].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][3].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][4].get_attr('val'))) &&
                this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][5].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][6].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][7].get_attr('val'))) &&
                this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][8].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][9].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][10].get_attr('val')))) {
                ++card_pairs;
            }else if(this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][0].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][1].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][2].get_attr('val'))) &&
                this.check_cards_aa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][3].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][4].get_attr('val'))) &&
                this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][5].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][6].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][7].get_attr('val'))) &&
                this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][8].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][9].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][10].get_attr('val')))){
                ++card_pairs;
            }else if(this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][0].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][1].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][2].get_attr('val'))) &&
                this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][3].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][4].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][5].get_attr('val'))) &&
                this.check_cards_aa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][6].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][7].get_attr('val'))) &&
                this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][8].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][9].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][10].get_attr('val')))){
                ++card_pairs;
            }else if(this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][0].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][1].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][2].get_attr('val'))) &&
                this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][3].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][4].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][5].get_attr('val'))) &&
                this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][8].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][9].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][10].get_attr('val'))) &&
                this.check_cards_aa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][6].get_attr('val')),
                    parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][7].get_attr('val')))){
                ++card_pairs;
            }else{
                return false;
            }
        }
        length = this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND].length;
        if(length){
            if (2 == length) {
                if (!this.check_cards_aa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][1].get_attr('val')))) {
                    return false;
                } else {
                    ++card_pairs;
                }
            } else if (3 == length) {
                if (!this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][2].get_attr('val')))) {
                    return false;
                }
            } else if (5 == length) {
                if (this.check_cards_aa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][1].get_attr('val'))) &&
                    this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][2].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][4].get_attr('val')))) {
                    ++card_pairs;
                }else if(this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][2].get_attr('val'))) &&
                    this.check_cards_aa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][4].get_attr('val')))){
                    ++card_pairs;
                }else{
                    return false;
                }
            }else if (8 == length){
                if (this.check_cards_aa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][1].get_attr('val'))) &&
                    this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][2].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][4].get_attr('val'))) &&
                    this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][5].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][6].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][7].get_attr('val')))) {
                    ++card_pairs;
                }else if(this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][2].get_attr('val'))) &&
                    this.check_cards_aa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][4].get_attr('val'))) &&
                    this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][5].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][6].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][7].get_attr('val')))){
                    ++card_pairs;
                }else if(this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][2].get_attr('val'))) &&
                    this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][4].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][5].get_attr('val'))) &&
                    this.check_cards_aa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][6].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][7].get_attr('val')))){
                    ++card_pairs;
                }else{
                    return false;
                }
            }else if (11 == length){
                if (this.check_cards_aa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][1].get_attr('val'))) &&
                    this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DRAGON][2].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][4].get_attr('val'))) &&
                    this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][5].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][6].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][7].get_attr('val'))) &&
                    this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][8].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][9].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][10].get_attr('val')))) {
                    ++card_pairs;
                }else if(this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][2].get_attr('val'))) &&
                    this.check_cards_aa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][4].get_attr('val'))) &&
                    this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][5].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][6].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][7].get_attr('val'))) &&
                    this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][8].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][9].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][10].get_attr('val')))){
                    ++card_pairs;
                }else if(this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][2].get_attr('val'))) &&
                    this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][4].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][5].get_attr('val'))) &&
                    this.check_cards_aa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][6].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][7].get_attr('val'))) &&
                    this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][8].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][9].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][10].get_attr('val')))){
                    ++card_pairs;
                }else if(this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][2].get_attr('val'))) &&
                    this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][4].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][5].get_attr('val'))) &&
                    this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][8].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][9].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][10].get_attr('val'))) &&
                    this.check_cards_aa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][6].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_WIND][7].get_attr('val')))){
                    ++card_pairs;
                }else{
                    return false;
                }
            }
        }
        length = this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER].length;
        if(length){
            if (2 == length) {
                if (!this.check_cards_aa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][1].get_attr('val')))) {
                    return false;
                } else {
                    ++card_pairs;
                }
            }else if (3 == length) {
                if (!this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][2].get_attr('val')))) {
                    if (!this.check_cards_abc(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][0].get_attr('val')),
                            parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][1].get_attr('val')),
                            parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][2].get_attr('val')))){
                        return false;
                    }
                }
            }else if (5 == length) {
                if(!this.check_cards_5(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][2].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][4].get_attr('val')))){
                    return false;
                }
                else{
                    ++card_pairs;
                }
            }else if (6 == length) {
                if(!this.check_cards_6(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][2].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][4].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][5].get_attr('val')))){
                    return false;
                }
            }else if (8 == length) {
                if(!this.check_cards_8(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][2].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][4].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][5].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][6].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][7].get_attr('val')))){
                    return false;
                }
            }else if (9 == length) {
                if(!this.check_cards_9(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][2].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][4].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][5].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][6].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][7].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][8].get_attr('val')))){
                    return false;
                }
            }else if (11 == length) {
                if(!this.check_cards_11(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][2].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][4].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][5].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][6].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][7].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][8].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][9].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][10].get_attr('val')))){
                    return false;
                }else{
                    ++card_pairs;
                }
            }else if (12 == length) {
                if(!this.check_cards_12(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][2].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][4].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][5].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][6].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][7].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][8].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][9].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][10].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][11].get_attr('val')))){
                    return false;
                }
            }else if (14 == length) {
                if(!this.check_cards_14(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][2].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][4].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][5].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][6].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][7].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][8].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][9].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][10].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][11].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][12].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_CHARACTER][13].get_attr('val')))){
                    return false;
                }else{
                    ++card_pairs;
                }
            }
        }
        length = this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO].length;
        if(length){
            if (2 == length) {
                if (!this.check_cards_aa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][1].get_attr('val')))) {
                    return false;
                } else {
                    ++card_pairs;
                }
            }else if (3 == length) {
                if (!this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][2].get_attr('val')))) {
                    if (!this.check_cards_abc(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][0].get_attr('val')),
                            parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][1].get_attr('val')),
                            parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][2].get_attr('val')))){
                        return false;
                    }
                }
            }else if (5 == length) {
                if(!this.check_cards_5(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][2].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][4].get_attr('val')))){
                    return false;
                }
                else{
                    ++card_pairs;
                }
            }else if (6 == length) {
                if(!this.check_cards_6(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][2].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][4].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][5].get_attr('val')))){
                    return false;
                }
            }else if (8 == length) {
                if(!this.check_cards_8(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][2].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][4].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][5].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][6].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][7].get_attr('val')))){
                    return false;
                }
            }else if (9 == length) {
                if(!this.check_cards_9(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][2].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][4].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][5].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][6].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][7].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][8].get_attr('val')))){
                    return false;
                }
            }else if (11 == length) {
                if(!this.check_cards_11(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][2].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][4].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][5].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][6].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][7].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][8].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][9].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][10].get_attr('val')))){
                    return false;
                }else{
                    ++card_pairs;
                }
            }else if (12 == length) {
                if(!this.check_cards_12(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][2].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][4].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][5].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][6].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][7].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][8].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][9].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][10].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][11].get_attr('val')))){
                    return false;
                }
            }else if (14 == length) {
                if(!this.check_cards_14(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][2].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][4].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][5].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][6].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][7].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][8].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][9].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][10].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][11].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][12].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_BAMBOO][13].get_attr('val')))){
                    return false;
                }else{
                    ++card_pairs;
                }
            }
        }
        length = this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT].length;
        if(length){
            if (2 == length) {
                if (!this.check_cards_aa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][1].get_attr('val')))) {
                    return false;
                } else {
                    ++card_pairs;
                }
            }else if (3 == length) {
                if (!this.check_cards_aaa(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][2].get_attr('val')))) {
                    if (!this.check_cards_abc(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][0].get_attr('val')),
                            parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][1].get_attr('val')),
                            parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][2].get_attr('val')))){
                        return false;
                    }
                }
            }else if (5 == length) {
                if(!this.check_cards_5(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][2].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][4].get_attr('val')))){
                    return false;
                }
                else{
                    ++card_pairs;
                }
            }else if (6 == length) {
                if(!this.check_cards_6(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][2].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][4].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][5].get_attr('val')))){
                    return false;
                }
            }else if (8 == length) {
                if(!this.check_cards_8(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][2].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][4].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][5].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][6].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][7].get_attr('val')))){
                    return false;
                }
            }else if (9 == length) {
                if(!this.check_cards_9(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][2].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][4].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][5].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][6].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][7].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][8].get_attr('val')))){
                    return false;
                }
            }else if (11 == length) {
                if(!this.check_cards_11(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][2].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][4].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][5].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][6].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][7].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][8].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][9].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][10].get_attr('val')))){
                    return false;
                }else{
                    ++card_pairs;
                }
            }else if (12 == length) {
                if(!this.check_cards_12(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][2].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][4].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][5].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][6].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][7].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][8].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][9].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][10].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][11].get_attr('val')))){
                    return false;
                }
            }else if (14 == length) {
                if(!this.check_cards_14(parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][0].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][1].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][2].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][3].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][4].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][5].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][6].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][7].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][8].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][9].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][10].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][11].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][12].get_attr('val')),
                        parseInt(this.card_list_hand[consts.CARD_TYPE.CARD_TYPE_DOT][13].get_attr('val')))){
                    return false;
                }else{
                    ++card_pairs;
                }
            }
        }
    }
    if(1 == card_pairs){
        return true;
    }
    return false;
};

game_player_wrapper.prototype.is_grand_4_happiness = function(){
    if(this.card_list_kong[consts.CARD_TYPE.CARD_TYPE_WIND].length == 16){
        for(var i = 0; i < consts.CARD_TYPE_MAX; ++i){
            if(this.card_list_hand[i].length == 2){
                if(this.card_list_hand[i][0] == this.card_list_hand[i][1]){
                    return true;
                }
            }
        }
    }
    return false;
};

game_player_wrapper.prototype.is_grand_3_chiefs = function(){
    if(this.card_list_kong[consts.CARD_TYPE.CARD_TYPE_WIND].length == 12){
        for(var i = 0; i < consts.CARD_TYPE_MAX; ++i){
            if(this.card_list_hand[i].length == 2){
                if(this.card_list_hand[i][0] == this.card_list_hand[i][1]){
                    return true;
                }
            }
        }
    }
    return false;
};

game_player_wrapper.prototype.create_card = function(card_type,card_val){
    var __object_card = object_template.create_object_card();
    __object_card.set_attr('type',card_type);
    __object_card.set_attr('val',card_val);
    return __object_card;
};

game_player_wrapper.prototype.check_win = function(card_type,card_val){
    return ;
    this.add_card(card_type,card_val);
    this.check_win_actually(true);
    this.del_card(card_type,card_val);
};

game_player_wrapper.prototype.check_cards_aa = function(val1,val2){
    return val1 == val2;
};

game_player_wrapper.prototype.check_cards_aaa = function(val1,val2,val3){
    return (val1 == val2 && val2 == val3);
};

game_player_wrapper.prototype.check_cards_aaaa = function(val1,val2,val3,val4){
    return (val1 == val2 && val2 == val3 && val3 == val4);
};

game_player_wrapper.prototype.check_cards_abc = function(val1,val2,val3){
    return (val1 == (val2 - 1) && val2 == (val3 - 1));
};

game_player_wrapper.prototype.check_cards_aabbcc = function(val1,val2,val3,val4,val5,val6){
    if(val1 == val2 && val3 ==  val4 && val5 == val6){
        if((val1 == val3-1)&&(val3 == val5-1))
        {
            return true;
        }
    }
    return false
};

game_player_wrapper.prototype.check_cards_3 = function(val1,val2,val3){
    //  aaa or abc
    if(this.check_cards_aaa(val1,val2,val3)){
        return true;
    }
    if(this.check_cards_abc(val1,val2,val3)){
        return true;
    }
};

game_player_wrapper.prototype.check_cards_5 = function(val1,val2,val3,val4,val5){
    //  aabbb
    if(this.check_cards_aa(val1,val2)){
        if(this.check_cards_3(val3,val4,val5)){
            return true;
        }
    }
    //  abbbc
    if(this.check_cards_aaa(val2,val3,val4)){
        if(this.check_cards_abc(val1,val4,val5)){
            return true;
        }
    }
    //  abcdd / abccc
    if(this.check_cards_aa(val4,val5)){
        if(this.check_cards_3(val1,val2,val3)){
            return true;
        }
    }
    return false;
};

game_player_wrapper.prototype.check_cards_6 = function(val1,val2,val3,val4,val5,val6){
    if(this.check_cards_3(val1,val2,val3) && this.check_cards_3(val4,val5,val6)) {
        return true;
    }
    //  aabbcc
    if(this.check_cards_aabbcc(val1,val2,val3,val4,val5,val6)){
        return true;
    }

    //  aaaa
    if(this.check_cards_aaaa(val2,val3,val4,val5)) {
        if(this.check_cards_abc(val1,val2,val6)){
            return true;
        }
    }
    return false;
};

game_player_wrapper.prototype.check_cards_8 = function(val1,val2,val3,val4,val5,val6,val7,val8){
    //  the val1,val2 is pairs
    if(this.check_cards_aa(val1,val2)) {
        return this.check_cards_6(val3,val4,val5,val6,val7,val8);
    }
    //  the val4,val5 is pairs
    if(this.check_cards_aa(val4,val5)) {
        if(this.check_cards_3(val1,val2,val3) && this.check_cards_3(val6,val7,val8)) {
            return true;
        }
    }
    //  the val7,val8 is pairs
    if(this.check_cards_aa(val1,val2)) {
        return this.check_cards_6(val1,val2,val3,val4,val5,val6);
    }
    return false;
};

game_player_wrapper.prototype.check_cards_9 = function(val1,val2,val3,val4,val5,val6,val7,val8,val9){
    if(this.check_cards_abc(val1,val2,val3) && this.check_cards_6(val4,val5,val6,val7,val8,val9)){
        return true;
    }
    if(this.check_cards_aaa(val1,val2,val3) && this.check_cards_6(val4,val5,val6,val7,val8,val9)){
        return true;
    }
    if(this.check_cards_abc(val7,val8,val9) && this.check_cards_6(val1,val2,val3,val4,val5,val6)){
        return true;
    }
    if(this.check_cards_aaa(val7,val8,val9) && this.check_cards_6(val1,val2,val3,val4,val5,val6)){
        return true;
    }
    return false;
};

game_player_wrapper.prototype.check_cards_11 = function(val1,val2,val3,val4,val5,val6,val7,val8,val9,val10,val11){
    if(this.check_cards_aa(val1,val2)){
        return this.check_cards_9(val3,val4,val5,val6,val7,val8,val9,val10,val11);
    }
    if(this.check_cards_aa(val4,val5)){
       if(this.check_cards_3(val1,val2,val3) && this.check_cards_6(val4,val5,val6,val7,val8,val9)){
            return true;
       }
    }
    if(this.check_cards_aa(val7,val8)){
        if(this.check_cards_3(val9,val10,val1) && this.check_cards_6(val1,val2,val3,val4,val5,val6)){
            return true;
        }
    }
    if(this.check_cards_aa(val10,val11)){
        return this.check_cards_9(val1,val2,val3,val4,val5,val6,val7,val8,val9);
    }
    return false;
};

game_player_wrapper.prototype.check_cards_12 = function(val1,val2,val3,val4,val5,val6,val7,val8,val9,val10,val11,val12){
    if(this.check_cards_abc(val1,val2,val3) && this.check_cards_9(val4,val5,val6,val7,val8,val9,val10,val11,val12)){
        return true;
    }
    if(this.check_cards_aaa(val1,val2,val3) && this.check_cards_9(val4,val5,val6,val7,val8,val9,val10,val11,val12)){
        return true;
    }
    if(this.check_cards_abc(val10,val1,val2) && this.check_cards_9(val1,val2,val3,val4,val5,val6,val7,val8,val9)){
        return true;
    }
    if(this.check_cards_aaa(val10,val1,val2) && this.check_cards_9(val1,val2,val3,val4,val5,val6,val7,val8,val9)){
        return true;
    }
    if(this.check_cards_6(val1,val2,val3,val4,val5,val6) && this.check_cards_6(val7,val8,val9,val10,val11,val12)){
        return true;
    }
    return false;
};

game_player_wrapper.prototype.check_cards_14 = function(val1,val2,val3,val4,val5,val6,val7,val8,val9,val10,val11,val12,val13,val14){
    if(this.check_cards_aa(val1,val2)){
        return this.check_cards_12(val4,val5,val6,val7,val8,val9,val10,val11,val12,val13,val14);
    }
    if(this.check_cards_aa(val4,val5)){
        if(this.check_cards_3(val1,val2,val3) && this.check_cards_9(val1,val2,val3,val4,val5,val6,val7,val8,val9)){
            return true;
        }
        return false;
    }
    if(this.check_cards_aa(val7,val8)){
        if(this.check_cards_6(val1,val2,val3,val4,val5,val6) && this.check_cards_6(val9,val10,val11,val12,val13,val14)){
            return true;
        }
        return false;
    }
    if(this.check_cards_aa(val10,val1)){
        if(this.check_cards_3(val12,val3,val4) && this.check_cards_9(val1,val2,val3,val4,val5,val6,val7,val8,val9)){
            return true;
        }
        return false;
    }
    if(this.check_cards_aa(val13,val4)){
        return this.check_cards_12(val1,val2,val3,val4,val5,val6,val7,val8,val9,val10,val11);
    }
    return false;
};

game_player_wrapper.prototype.get_card_index = function(card_type,card_val){
    var tmp_index = 0;
    for(var i = 0; i < consts.CARD_TYPE.CARD_TYPE_MAX; ++i){
        for(var j = 0; j < this.card_list_hand[i].length; ++j){
            if(card_type == i && card_val == parseInt(this.card_list_hand[i][j].get_attr('val'))){
                return tmp_index;
            }
            tmp_index++;
        }
    }
};

game_player_wrapper.prototype.get_card_by_index = function(index){
    var tmp_index = 0;
    for(var i = 0; i < consts.CARD_TYPE.CARD_TYPE_MAX; ++i){
        for(var j = 0; j < this.card_list_hand[i].length; ++j){
            if(index == tmp_index){
                return this.card_list_hand[i][j];
            }
            tmp_index++;
        }
    }
    return null;
};

game_player_wrapper.prototype.get_card_count = function(){
    var tmp_count = 0;
    for(var i = 0; i < consts.CARD_TYPE.CARD_TYPE_MAX; ++i){
        for(var j = 0; j < this.card_list_hand[i].length; ++j){
            tmp_count++;
        }
    }
    return tmp_count;
};