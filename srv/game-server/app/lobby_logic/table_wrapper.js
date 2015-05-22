/**
 * Created by Administrator on 2015/5/21.
 */
var player_wrapper = require('./player_wrapper');
var pomelo = require('pomelo');
var consts = require('../util/consts');
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
};

module.exports = table_wrapper;

table_wrapper.prototype.init = function(lid,rid,tid){
    this.lid = lid;
    this.rid = rid;
    this.tid = tid;
};

table_wrapper.prototype.enter_game = function(username,sid){
    for(var i = 0; i < this.joiner_list.length; ++i){
        if(this.joiner_list[i].username == username){
            return 0;
        }
    }
    var __player_wrapper = new player_wrapper();
    __player_wrapper.init(username,sid);
    this.joiner_list.push(__player_wrapper);
    return 1;
};

table_wrapper.prototype.enter_game_notice = function(username){
    var channelService = pomelo.app.get('channelService');
    var channel_name =  'lid_' + this.lid;
    var channel = channelService.getChannel(channel_name, false);
    var res_msg = {};
    res_msg.msg_id = consts.TYPE_MSG.TYPE_MSG_ENTER_GAME;
    var param = {
        route: 'on_msg',
        msg: res_msg,
        from: username,
        target: username
    };
    for(var i = 0; i < this.joiner_list.length; ++i){
        var player_wrapper = this.joiner_list[i];
        if(player_wrapper){
            //if(player_wrapper.get_username() != username)
            {
                var tuid = player_wrapper.get_uid();
                var tsid = channel.getMember(tuid)['sid'];
                param.target = player_wrapper.get_username();
                channelService.pushMessageByUids(param, [{
                    uid: tuid,
                    sid: tsid
                }]);
            }
        }
    }
};