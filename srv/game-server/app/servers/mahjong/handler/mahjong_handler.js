/**
 * Created by Administrator on 2015/5/19.
 */
module.exports = function(app) {
    return new Handler(app);
};

var Handler = function(app) {
    this.app = app;
};

var handler = Handler.prototype;

handler.test = function(msg, session, next) {

};