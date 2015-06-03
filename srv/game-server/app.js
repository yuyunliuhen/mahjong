var pomelo = require('pomelo');
var user_wrapper = require('./app/user/user_wrapper');
var sessions_wrapper = require('./app/lobby_logic/sessions_wrapper');
var lobby_manager = require('./app/lobby_logic/lobby_manager');
var game_logic_manager = require('./app/mahjong_logic/game_logic_manager');
/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'srv');

// app configuration
app.configure('production|development', 'connector', function(){
  app.set('connectorConfig',
    {
      connector : pomelo.connectors.hybridconnector,
      heartbeat : 3,
      useDict : true,
      useProtobuf : true
    });
  //  redis configure
  app.loadConfig('redis', app.getBase() + '/config/redis.json');
  console.log("config load for redis  %s", app.getBase() + '/config/redis.json');
  require('./app/nosql/redis_pools').configure(app.get('redis'));

  var __user_wrapper = new user_wrapper();
  app.set('user_wrapper',__user_wrapper);

});

app.configure('production|development', 'lobby', function(){
  var __lobby_manager= new lobby_manager();
  app.set('lobby_manager',__lobby_manager);

  var __sessions_wrapper= new sessions_wrapper();
  app.set('sessions_wrapper',__sessions_wrapper);

});

app.configure('production|development', 'mahjong', function(){
  var __game_logic_manager = new game_logic_manager();
  app.set('game_logic_manager',__game_logic_manager);

});

var router = function(routeParam, msg, context, cb) {
  var  servers_asc = function(a,b){
    if (a.no > b.no)
      return 1;
    if (a.no < b.no)
      return -1;
  };
  var servers = app.getServersByType('mahjong');
  servers.sort(servers_asc);
  var id = servers[routeParam % servers.length].id;
  cb(null, id);
};

app.route('mahjong', router);

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
