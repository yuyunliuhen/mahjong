/**
 * Created by Administrator on 2015/5/12.
 */

var redis_user_wrapper = require('../nosql/redis_user_wrapper');

var user_wrapper = function() {

};

module.exports = user_wrapper;

/**
 * get user by name
 * @param name:  user name
 */
user_wrapper.prototype.get_user = function(name,cb){
    redis_user_wrapper.get_user(name,function(user_data){
        cb(user_data);
    });
};

/**
 * save user data to db
 * @param name
 * @param user_data
 */
user_wrapper.prototype.save_db = function(name,user_data,cb){
    redis_user_wrapper.set_user(name,user_data,function(user_data){
        cb(user_data);
    });
};

