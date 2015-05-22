/**
 * Created by Administrator on 2015/5/20.
 */


//  one bout of mahjong
var mahjong_logic = function(){
    this.table_id = 0;

};

module.exports = game_logic;

/**
 * set room of table' s id
 * @param table_id
 */
mahjong_logic.prototype.set_table_id = function(table_id){
    this.table_id = table_id;
};

/**
 * get room of table' s id
 */
mahjong_logic.prototype.get_table_id = function(){
    this.table_id = table_id;
};

var logic_wrapper = function(){

};

module.exports = logic_wrapper;

logic_wrapper.prototype.init = function(room_id){

};