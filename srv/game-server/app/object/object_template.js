/**
 * Created by Administrator on 2015/5/18.
 */
var data = require('./data');
var object_user = require('./object_user');

var object_template = function(){

};

module.exports = object_template;

object_template.create_object = function(type){
    var object = null;
    if('object_user' == type){
        object = object_template.create_object_user();
    }
    return object;
};

object_template.create_object_user = function(){
    var __object_user = new object_user();
    __object_user.reg_attr('username',"");
    __object_user.reg_attr('nickname',"");
    __object_user.reg_attr('sex',0);
    __object_user.reg_attr('gold',0);
    __object_user.reg_attr('total_count',0);
    __object_user.reg_attr('win_count',0);
    __object_user.reg_attr('level',0);
    console.log("%j",__object_user);
    return __object_user;
};