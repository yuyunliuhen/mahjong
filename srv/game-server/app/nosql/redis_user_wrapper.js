/**
 * Created by Administrator on 2015/5/12.
 */
var redis_pools = require("../nosql/redis_pools");
var consts = require("../util/consts");
var h_user = 'h_user';
var z_user_id = 'z_user_id';

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

redis_user_wrapper.add_user_id = function(name,user_data,cb){
    redis_pools.execute('pool_1',function(client, release){
        client.zadd(z_user_id,1,consts.USER_KEY,function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            cb(reply);
            release();
        });
    });
};

redis_user_wrapper.get_user_id = function(cb){
    redis_pools.execute('pool_1',function(client, release){
        var args = [ z_user_id,0,-1,"withscores"];
        client.zrange(args,function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            cb(reply[1]);
            release();
        });
    });
};