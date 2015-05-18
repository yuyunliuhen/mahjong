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
    var object_user = new object_user();
    object_user.reg_attr('username',"");
    object_user.reg_attr('rid',0);
    return object_user;
};