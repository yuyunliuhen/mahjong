/**
 * Created by Administrator on 2015/5/27.
 */
var sessions_wrapper = function(){
    this.sessions = {};
};

module.exports = sessions_wrapper;

sessions_wrapper.prototype.add = function(uid,lid,rid,tid){
    this.sessions[uid] = {
        lid:lid,
        rid:rid,
        tid:tid
    };
};

sessions_wrapper.prototype.get_lid = function(uid){
    return this.sessions[uid].lid;
};

sessions_wrapper.prototype.get_rid = function(uid){
    return this.sessions[uid].rid;
};

sessions_wrapper.prototype.get_tid = function(uid){
    return this.sessions[uid].tid;
};

sessions_wrapper.prototype.del = function(uid){
    this.sessions[uid] = null;
};

