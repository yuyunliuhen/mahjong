/**
 * Created by Administrator on 2015/5/18.
 */
var data = require('./data');
var object_user = require('./object_user');

var object_template = function(){

};

module.exports = object_template;

object_template.create_object = function(type){
    var __object = null;
    if('object_user' == type){
        __object = object_template.create_object_user();
    }
    return __object;
};

object_template.create_object_user = function(){
    var __object_user = new object_user();
    __object_user.reg_attr('name',"");
    __object_user.reg_attr('rid',0);
    return __object_user;
};