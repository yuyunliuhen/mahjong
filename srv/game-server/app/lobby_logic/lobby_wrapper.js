/**
 * Created by Administrator on 2015/5/21.
 */

var json_game_region = require('../../config/game_region');
var region_wrapper = require('./region_wrapper');
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

lobby_wrapper.prototype.enter_lobby = function(){
    ++this.online_num;
};

lobby_wrapper.prototype.enter_room = function(rid){
    this.region_list[rid].enter_room();
};

lobby_wrapper.prototype.enter_game = function(rid,username,sid,cb){
    this.region_list[rid].enter_game(username,sid,cb);
};