var pomelo = require('pomelo');
var user_wrapper = require('./app/user/user_wrapper');
var lobby_manager = require('./app/lobby_logic/lobby_manager');
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
