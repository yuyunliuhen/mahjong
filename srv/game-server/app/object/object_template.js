/**
 * Created by Administrator on 2015/5/18.
 */
var data = require('./data');
var object_user = require('./object_user');
var object_card = require('./object_card');
var object_card_chow = require('./object_card_chow');

var object_template = function(){

};

module.exports = object_template;

object_template.create_object = function(type){
    var object = null;
    if('object_user' == type){
        object = object_template.create_object_user();
    }else if('object_card' == type){
        object = object_template.create_object_card();
    }
    return object;
};

object_template.create_object_user = function(){
    var __object_user = new object_user();
    __object_user.reg_attr('id',"123456");
    __object_user.reg_attr('username',"");
    __object_user.reg_attr('nickname',"");
    __object_user.reg_attr('sex',0);
    __object_user.reg_attr('gold',10000);
    __object_user.reg_attr('total_count',0);
    __object_user.reg_attr('win_count',0);
    __object_user.reg_attr('level',1);
    console.log("%j",__object_user);
    return __object_user;
};

object_template.create_object_card = function(){
    var __object_card = new object_card();
    __object_card.reg_attr('type',0);
    __object_card.reg_attr('val',0);
    return __object_card;
};

object_template.create_object_card_chow = function(){
    var __object_card_chow = new object_card_chow();
    __object_card_chow.reg_attr('type',0);
    __object_card_chow.reg_attr('val1',0);
    __object_card_chow.reg_attr('val2',0);
    __object_card_chow.reg_attr('val3',0);
    return __object_card_chow;
};