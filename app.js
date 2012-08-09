
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');
var mongo = require('mongoskin');

var app = module.exports = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('uOIweAsq2'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);
var current_visits = 0;

io.sockets.on('connection', function (socket) {
    socket.join('listener');
    io.sockets.in('listener').emit('update', { current_visits: current_visits });
});

var countdown = function() {
    console.log(current_visits);
    if(current_visits > 0) {
        current_visits--;
        io.sockets.in('listener').emit('update', { current_visits: current_visits });
    }
};
// Logging Server

http.createServer(function (request, response) {
    mongo.db('localhost:27017/nodissimo').collection('visits').insert({
        timestamp: new Date(),
        useragent: request.headers['user-agent']
    });
    current_visits++;
    io.sockets.in('listener').emit('update', { current_visits: current_visits });
    setTimeout(countdown, 1000);
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Logged');
}).listen(8080);

