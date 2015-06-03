/**
 * Created by Administrator on 2015/5/18.
 */
var data = require('./data');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var object = function(){
    EventEmitter.call(this);
    this.type = "object";
    this.data = new data();
};

util.inherits(object, EventEmitter);

module.exports = object;

object.prototype.set_type = function(type){
    this.type = type;
};

object.prototype.get_type = function(type){
    return this.type;
};

object.prototype.reg_attr = function(key,val){
    this.data.reg_attr(key,val)
};

object.prototype.set_attr = function(key,val){
    this.data.set_attr(key,val);
};

object.prototype.get_attr = function(key){
    return this.data.get_attr(key);
};

object.prototype.json_2_string = function(){
    return this.data.json_2_string();
};

object.prototype.load_data = function(user_data){
    return this.data.load_data(user_data);
};