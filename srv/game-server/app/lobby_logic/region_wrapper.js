/**
 * Created by Administrator on 2015/5/21.
 */
var table_wrapper = require('./table_wrapper');
var consts = require('../util/consts');
var region_wrapper = function(){
    this.online_num = 0;
    this.users = [];
    this.table_list = {};
};

module.exports = region_wrapper;

region_wrapper.prototype.init = function(lid,region_info,max_room_num){
    this.lid = lid;
    this.id = region_info.id;
    this.chip = region_info.chip;
    this.cost = region_info.cost;
    this.min_gold = region_info.min_gold;
    this.max_gold = region_info.max_gold;
    this.note = region_info.note;
    this.max_table_num = max_room_num;
    for(var i = 1; i <= this.max_table_num; ++i){
        var __table_wrapper = new table_wrapper();
        __table_wrapper.init(this.lid,this.id,i);
        this.table_list[i] = __table_wrapper;
    }
};

region_wrapper.prototype.pack_data = function(){
    var array_table_data = [];
    for(var v in this.table_list){
        array_table_data.push(this.table_list[v].pack_data());
    }
    return {
        id:this.id,
        chip:this.chip,
        cost:this.cost,
        note:this.note,
        online_num:this.online_num,
        array_table_data:array_table_data
    };
};

region_wrapper.prototype.pack_simple_data = function(){
    var array_table_data = [];
    for(var v in this.table_list){
        array_table_data.push(this.table_list[v].pack_simple_data());
    }
    return {
        id:this.id,
        chip:this.chip,
        cost:this.cost,
        note:this.note,
        online_num:this.online_num,
        array_table_data:array_table_data
    };
};

region_wrapper.prototype.enter_room = function(username){
    ++this.online_num;
    this.users.push(username);
};

region_wrapper.prototype.leave_room = function(username){
    --this.online_num;
   for(var i = 0; i < this.users.length; ++i){
       if(username == this.uses[i]){
           this.uses.remove(i);
       }
   }
};

region_wrapper.prototype.enter_game = function (username, sid, tid, cb) {
    var table_wrapper = this.table_list[tid];
    if (table_wrapper) {
        if (table_wrapper.joiner_list.length < consts.MAX_NUM_PLAYER_PER_TABLE) {
            var pos_index = table_wrapper.enter_game(username, sid,cb);
            if (-1 != pos_index) {
                table_wrapper.enter_game_notice(username,pos_index);
            }
        }
    }
};

region_wrapper.prototype.leave_game = function(username,sid,tid,cb){
    var success = 0;
    this.table_list[tid].leave_game(username,sid);
    cb(success);
};

region_wrapper.prototype.get_online_num = function(){
    return this.online_num;
};

region_wrapper.prototype.get_rid = function(){
    return this.id;
};

region_wrapper.prototype.get_available_tid = function(){
    for(var i = 0; i < this.max_table_num; ++i){
        var __table_wrapper = this.table_list[i];
        if(__table_wrapper){
            var num_player = __table_wrapper.get_num_player();
            if(num_player < consts.MAX_NUM_PLAYER_PER_TABLE){
                return __table_wrapper.get_tid();
            }
        }
    }
    return -1;
};

region_wrapper.prototype.game_over = function(tid){
	this.table_list[tid].clear();
};
