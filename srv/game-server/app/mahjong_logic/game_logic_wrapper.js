/**
 * Created by Administrator on 2015/5/20.
 */


//  one bout of mahjong
var game_logic_wrapper = function(){
    this.table_id = 0;
    this.player_num = 0;
    this.game_type = 0;
    this.game_status = 0;
    this.player_list = [];
    this.start_time = 0;
    this.last_time = 0;
    this.wait_time = 0;
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

};

game_logic_wrapper.prototype.get_player_count = function(useranme){
    return player_list.length;
};
