/**
 * Created by Administrator on 2015/5/18.
 */
var object = require('./object');
var util = require('util');

var object_user = function(){
    object.call(this);
    this.set_type('object_user');
};

util.inherits(object_user, object);

module.exports = object_user;

object_user.prototype.init = function(username){
    this.set_attr('username',username);
};

