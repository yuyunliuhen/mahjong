/**
 * Created by King Lee on 14-4-15.
 */
var _ = require('underscore');
var message_mgr = module.exports;

message_mgr.container = [];

message_mgr.handler = function( mid,cb ) {
    this.container[mid] = cb;
};

message_mgr.trigger = function(mid,msg,session,next ) {
    if( _.isString(mid) ){
        mid = parseInt(mid);
    }
    if( this.container[mid] ){
        this.container[mid](msg,session,next);
    }
};