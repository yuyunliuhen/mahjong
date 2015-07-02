/**
 * Created by Administrator on 2015/7/2.
 */
var pomelo = require('pomelo');
var redis_user_wrapper = require('../../../nosql/redis_user_wrapper');

module.exports = function(app) {
    return new connector_remote(app);
};

var connector_remote = function(app) {
    this.app = app;
};

connector_remote.prototype.get_user_data = function(username,cb){
    redis_user_wrapper.get_user(username, function (user_data) {
        cb(user_data);
    });
};