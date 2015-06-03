/**
 * Created by Administrator on 2015/5/20.
 */
var player_wrapper = function(){

};

module.exports = player_wrapper;

player_wrapper.prototype.init = function(username,sid,pos){
    this.username = username;
    this.uid = username + '*';
    this.sid = sid;
    this.pos = pos;
};

player_wrapper.prototype.get_username = function(){
    return this.username;
};

player_wrapper.prototype.get_sid = function(){
    return this.sid;
};

player_wrapper.prototype.get_uid = function(){
    return this.uid;
};

player_wrapper.prototype.get_pos = function(){
    return this.pos;
};