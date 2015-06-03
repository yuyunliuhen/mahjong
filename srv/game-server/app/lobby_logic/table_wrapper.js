/**
 * Created by Administrator on 2015/5/21.
 */
var player_wrapper = require('./player_wrapper');
var pomelo = require('pomelo');
var consts = require('../util/consts');
var log4js = require('log4js');
log4js.configure(require('../../config/log.json'));
var lobby_logger = log4js.getLogger('lobby-logger');

var table_wrapper = function(){
    this.cur_num = 0;
    this.tid = 0;
    this.rid = 0;
    this.lid = 0;
    this.table_name = '';
    this.hoster = '';
    this.have_pwd = 0;
    this.pwd = '';
    this.game_type = 0;
    this.gold = 0;
    this.game_status = 0;
    this.joiner_list = [];
    this.watcher_list = [];
    this.pos = new Array(4);
    for(var i = 0; i < this.pos.length; ++i){
        this.pos[i] = '';
    }
};

module.exports = table_wrapper;

table_wrapper.prototype.init = function(lid,rid,tid){
    this.lid = lid;
    this.rid = rid;
    this.tid = tid;
};

table_wrapper.prototype.enter_game = function(username,sid,cb){
    var self = this;
    for(var i = 0; i < this.joiner_list.length; ++i){
        if(this.joiner_list[i].username == username){
            cb(null);
            return -1;
        }
    }
    //  table is full
    if(this.joiner_list.length >= consts.MAX_NUM_PLAYER_PER_TABLE){
        cb(null);
        return -1;
    }
    var pos_index = self.find_pos(username);
    var __player_wrapper = new player_wrapper();
    __player_wrapper.init(username,sid,pos_index);
    this.joiner_list.push(__player_wrapper);

    //  somebody enter game already
    var joiner_data = [];
    for(var j = 0; j < self.joiner_list.length; ++j){
        var tmp_player_wrapper = self.joiner_list[j];
        if(tmp_player_wrapper){
            joiner_data.push([tmp_player_wrapper.get_username(),tmp_player_wrapper.get_pos()]);
        }
    }
    //  if table is full, notice player start game
    if(this.joiner_list.length == consts.MAX_NUM_PLAYER_PER_TABLE){
        pomelo.app.rpc.mahjong.mahjong_remote.start_game(null, this.tid,JSON.stringify(this.joiner_list),function(player_card_list_hand_array){
            self.start_game_notice( JSON.parse(player_card_list_hand_array));
            lobby_logger.debug("start_game : " + player_card_list_hand_array);
        });
    }
    cb(joiner_data);
    return pos_index;
};

table_wrapper.prototype.leave_game = function(username,sid){
    for(var i = 0; i < this.joiner_list.length; ++i){
        if(this.joiner_list[i].username == username){
            this.joiner_list.splice(i,1);
        }
    }
    for(i = 0; i <this.pos.length; ++i){
        if(username == this.pos[i]){
            this.pos[i] = "";
        }
    }
    if(0 == this.joiner_list){
        //  all player are exit!
        pomelo.app.rpc.mahjong.mahjong_remote.game_over(null, this.tid,function(){

        });
    }
};

table_wrapper.prototype.enter_game_notice = function(username,pos_index){
    var channelService = pomelo.app.get('channelService');
    var channel_name = consts.GLOBAL_SESSION;
    var channel = channelService.getChannel(channel_name, false);
    var res_msg = {};
    res_msg.msg_id = consts.TYPE_NOTICE.TYPE_NOTICE_ENTER_GAME;
    var param = {
        route: 'on_msg',
        msg: res_msg,
        from: username,
        target: username
    };
    for(var i = 0; i < this.joiner_list.length; ++i){
        var player_wrapper = this.joiner_list[i];
        if(player_wrapper){
            if(player_wrapper.get_username() != username)
            {
                var tuid = player_wrapper.get_uid();
                var tsid = channel.getMember(tuid)['sid'];
                param.target = player_wrapper.get_username();
                res_msg.pos = pos_index;
                console.log(param);
                channelService.pushMessageByUids(param, [{
                    uid: tuid,
                    sid: tsid
                }]);
                lobby_logger.debug("enter_game_notice : %j",param);
            }
        }
    }
};

table_wrapper.prototype.start_game_notice = function(player_card_list_hand_array){
    var channelService = pomelo.app.get('channelService');
    var channel_name = consts.GLOBAL_SESSION;
    var channel = channelService.getChannel(channel_name, false);
    var res_msg = {};
    res_msg.msg_id = consts.TYPE_NOTICE.TYPE_NOTICE_START_GAME;
    var param = {
        route: 'on_msg',
        msg: res_msg,
        from: 'system',
        target:  'system'
    };
    for (var i = 0; i < player_card_list_hand_array.length; ++i) {
        var player_wrapper = this.get_joiner_by_uid(player_card_list_hand_array[i].uid);
        if (player_wrapper) {
            var tuid = player_wrapper.get_uid();
            var tsid = channel.getMember(tuid)['sid'];
            param.target = player_wrapper.get_username();
            res_msg.card_list_hand = player_card_list_hand_array[i].card_list_hand;
            res_msg.lid = this.lid;
            res_msg.rid = this.rid;
            res_msg.tid = this.tid;
            channelService.pushMessageByUids(param, [{
                uid: tuid,
                sid: tsid
            }]);
        }
    }
};

table_wrapper.prototype.pack_data = function() {
    return {
      "tid":this.tid,
      "table_name":this.table_name,
      "hoster":this.hoster,
      "cur_num":this.joiner_list.length
    };
};

table_wrapper.prototype.pack_simple_data = function() {
    return {
        "tid":this.tid,
        "cur_num":this.joiner_list.length
    };
};


table_wrapper.prototype.get_joiner_by_uid = function(uid){
    for(var i =0 ;i < this.joiner_list.length; ++i){
        var player_wrapper = this.joiner_list[i];
        if(player_wrapper){
            if(uid == player_wrapper.get_uid()){
                return player_wrapper;
            }
        }
    }
    return null;
};

table_wrapper.prototype.find_pos = function(username){
    for(var i = 0; i <this.pos.length; ++i){
        if('' == this.pos[i]){
            this.pos[i] = username;
            return i;
        }
    }
    return -1;
};
