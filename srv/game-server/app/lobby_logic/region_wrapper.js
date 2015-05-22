/**
 * Created by Administrator on 2015/5/21.
 */
var table_wrapper = require('./table_wrapper');
var consts = require('../util/consts');
var region_wrapper = function(){
    this.online_num = 0;
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
    this.max_table_num = max_room_num;
    for(var i = 0; i < this.max_table_num; ++i){
        var __table_wrapper = new table_wrapper();
        __table_wrapper.init(this.lid,this.id,i);
        this.table_list[i] = __table_wrapper;
    }
};

region_wrapper.prototype.pack_data = function(){
    return {
        id:this.id,
        chip:this.chip,
        cost:this.cost,
        online_num:this.online_num
    };
};

region_wrapper.prototype.enter_room = function(){
    ++this.online_num;
};

region_wrapper.prototype.enter_game = function(username,sid,cb){
    var success = 0;
    for(var v in this.table_list){
        var table_wrapper = this.table_list[v];
        if(table_wrapper){
            if(table_wrapper.joiner_list.length < consts.MAX_NUM_PLAYER_PER_TABLE){
                success = table_wrapper.enter_game(username,sid);
                if(success){
                    table_wrapper.enter_game_notice(username);
                    break;
                }
            }
        }
    }
    cb(success);
};


