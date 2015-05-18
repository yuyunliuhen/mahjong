var message_mgr = require('../../../util/message_mgr');
module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

/**
 * New client entry chat server.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
Handler.prototype.entry = function(msg, session, next) {
  message_mgr.trigger(msg.msg_id,msg,session,function(error,res_msg){
    next(null, res_msg);
  });
};

Handler.prototype.hello = function(msg, session, next) {
  console.log('hi.');
  next(null, {code: 200, msg: 'hi.'});
};