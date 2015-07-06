/**
 * Created by Administrator on 2015/5/21.
 */

var json_game_region = require('../../config/game_region');
var region_wrapper = require('./region_wrapper');
var consts = require('../util/consts');
//  one lobby information
var lobby_wrapper = function(){
    this.region_list = {};
    this.online_num = 0;
};

module.exports = lobby_wrapper;

lobby_wrapper.prototype.init = function(lobby_info){
    this.id = lobby_info.id;
    this.type = lobby_info.type;
    this.watcher = lobby_info.watcher;
    this.max_room_num = lobby_info.max_room_num;
    for(var i = 0; i < json_game_region.length; ++i){
        var __region_wrapper = new region_wrapper();
        __region_wrapper.init(this.id,json_game_region[i],this.max_room_num);
        this.region_list[json_game_region[i].id] = __region_wrapper;
    }
};

lobby_wrapper.prototype.pack_data = function(){
    var lobby_data = [];
    for(var v in this.region_list){
        var region_data = this.region_list[v].pack_data(v);
        lobby_data.push(region_data);
    }
    return lobby_data;
};

lobby_wrapper.prototype.enter_game = function(rid,tid,username,sid,cb){
    if(this.region_list[rid]) {
        this.region_list[rid].enter_game(username, sid, tid, cb);
    }
};

lobby_wrapper.prototype.leave_game = function(rid,tid,username,sid,cb){
    if(this.region_list[rid]) {
        this.region_list[rid].leave_game(username, sid, tid, cb);
    }
};

lobby_wrapper.prototype.pack_simple_data = function(){
    var lobby_data = [];
    for(var v in this.region_list){
        var region_data = this.region_list[v].pack_simple_data(v);
        lobby_data.push(region_data);
    }
    return lobby_data;
};

lobby_wrapper.prototype.get_available_rid = function(){
    for(var i = 0; i < json_game_region.length; ++i){
        var __region_wrapper = this.region_list[json_game_region[i].id];
        if(__region_wrapper){
            var online_num = __region_wrapper.get_online_num();
            if(online_num < consts.MAX_NUM_PLAYER_PER_ROOM){
                return __region_wrapper.get_rid();
            }
        }
    }
    return -1;
};

lobby_wrapper.prototype.get_available_tid = function(rid){
    if(this.region_list[rid]){
        return this.region_list[rid].get_available_tid();
    }
    return -1;
};

lobby_wrapper.prototype.game_over = function(rid,tid){
	if(this.region_list[rid]){   
		this.region_list[rid].game_over(tid);
	}
};
