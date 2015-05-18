/**
 * Created by Administrator on 2015/5/18.
 */
var data = function(){
    this.attr_ = [];
};

module.exports = data;

data.prototype.reg_attr = function(key,val){
    this.attr_[key] = val;
};

data.prototype.set_attr = function(key,val){
    this.attr_[key] = val;
};

data.prototype.get_attr = function(key){
    return this.attr_[key];
};

data.prototype.json_2_string = function(){
    return JSON.stringify(this.attr_);
};

data.prototype.load_data = function(user_data){
    this.attr_ = JSON.parse(user_data);
};