var pomelo = require('pomelo');

module.exports = function(app) {
    return new mahjong_remote(app);
};

var mahjong_remote = function(app) {
    this.app = app;
};

mahjong_remote.prototype.test = function(msg,cb){
    console.log("%j",msg);
    cb();
};

mahjong_remote.prototype.start_game = function(lid,rid,tid,cb){
    console.log(lid);
    cb();
};
