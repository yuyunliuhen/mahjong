/**
 * Created by Administrator on 2015/5/21.
 */
var consts = require('../util/consts');
var lobby_wrapper = require('./lobby_wrapper');
var json_lobby_list = require('../../config/lobby_list');

//  manager all lobby information
var lobby_manager = function(){
    this.lobby_list = {};
    this.init();
};

module.exports = lobby_manager;

lobby_manager.prototype.init = function(){
    for(var i = 0; i < json_lobby_list.length; ++i){
        var __lobby_wrapper = new lobby_wrapper();
        __lobby_wrapper.init(json_lobby_list[i]);
        this.lobby_list[json_lobby_list[i].id] = __lobby_wrapper;
    }
};

lobby_manager.prototype.get_region_list = function(lid){
    var lobby_wrapper = this.lobby_list[lid];
    if(lobby_wrapper){
        return lobby_wrapper.pack_data(lid);
    }
    return [];
};

lobby_wrapper.prototype.enter_lobby = function(lid){
    this.lobby_list[lid].enter_lobby();
};

lobby_wrapper.prototype.enter_room = function(lid,rid){
    this.lobby_list[lid].enter_room(rid);
};

lobby_manager.prototype.enter_game = function(lid,rid,tid,username,sid,cb){
    this.lobby_list[lid].enter_game(rid,tid,username,sid,cb);
};

lobby_manager.prototype.leave_game = function(lid,rid,tid,username,sid,cb){
    if(this.lobby_list[lid]){
        this.lobby_list[lid].leave_game(rid,tid,username,sid,cb);
    }
};

lobby_manager.prototype.pack_all_lobby_simple_data = function(){
    var array_lobby_info = [];
    for(var v in this.lobby_list){
        array_lobby_info.push(this.lobby_list[v].pack_simple_data());
    }
    return array_lobby_info;
};