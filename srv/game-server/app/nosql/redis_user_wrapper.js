/**
 * Created by Administrator on 2015/5/12.
 */
var redis_pools = require("../nosql/redis_pools");
var h_user = 'h_user';

var redis_user_wrapper = module.exports;

redis_user_wrapper.get_user = function(name,cb){
    redis_pools.execute('pool_1',function(client, release){
        client.hget(h_user,name,function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            cb(reply);
            release();
        });
    });
};

redis_user_wrapper.set_user = function(name,user_data,cb){
    redis_pools.execute('pool_1',function(client, release){
        client.hset(h_user,name,user_data,function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            cb(reply);
            release();
        });
    });
};
