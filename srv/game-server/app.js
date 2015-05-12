var pomelo = require('pomelo');

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
});

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
