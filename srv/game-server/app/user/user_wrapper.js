/**
 * Created by Administrator on 2015/5/12.
 */
var user_wrapper = function() {
    this.online_count = 0;
};

module.exports = user_wrapper;

user_wrapper.prototype.get_online_count = function(){
    return this.online_count;
};

user_wrapper.prototype.inc_online_count = function(){
    ++this.online_count;
};

user_wrapper.prototype.dec_online_count = function(){
    --this.online_count;
};