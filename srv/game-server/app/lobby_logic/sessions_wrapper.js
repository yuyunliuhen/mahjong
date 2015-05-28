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
    if(this.sessions[uid]){
        return this.sessions[uid].lid;
    }
    return -1;
};

sessions_wrapper.prototype.get_rid = function(uid){
    if(this.sessions[uid]){
        return this.sessions[uid].rid;
    }
    return -1;
};

sessions_wrapper.prototype.get_tid = function(uid){
    if(this.sessions[uid]){
        return this.sessions[uid].tid;
    }
    return -1;
};

sessions_wrapper.prototype.remove = function(uid){
    this.sessions[uid] = null;
};

