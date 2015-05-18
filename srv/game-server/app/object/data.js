/**
 * Created by Administrator on 2015/5/18.
 */
var data = function(){
    this.attr = [];
};

module.exports = data;

data.prototype.reg_attr = function(key,val){
    this.attr[key] = val;
};

data.prototype.set_attr = function(key,val){
    this.attr[key] = val;
};

data.prototype.get_attr = function(key){
    return this.attr[key];
};

data.prototype.json_2_string = function(){
    return JSON.stringify(this.attr);
};

data.prototype.load_data = function(user_data){
    this.attr = JSON.parse(user_data);
};