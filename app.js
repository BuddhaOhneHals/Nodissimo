
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , url = require('url')
  , util = require('util')
  , path = require('path');
var mongo = require('mongoskin');

// Express stuff. Do we need all of it?
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

// Starts the express server
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


// Logging Server
var io = require('socket.io').listen(server);
var liveListener = {};

io.sockets.on('connection', function (socket) {
    socket.on('addLiveListener', function (tags) {
        console.log(tags);
        liveListener[tags] = 0;
        socket.join(util.format('live-%s', tags));
    });
});

var parseTags = function(tags) {
    return tags.split(':');
}

var liveCountdown = function(tags) {
    console.log(tags);
    if(liveListener[tags] > 0) {
        liveListener[tags]--;
        io.sockets.in(util.format('live-%s', tags)).emit('liveUpdate', { value: tags, count: liveListener[tags] });
    }
};

http.createServer(function (request, response) {
    var mongodb = mongo.db('localhost:27017/nodissimo');
    var params = url.parse(request.url, true).query;
    var ptags = parseTags(params.tags);
    var tags = params.tags;
    var count = 1.0;
    var cur_date = new Date();

    if(params.count)
        count = parseFloat(params.count);

    // Insert the log request
    mongodb.collection('log_request').insert({
        tags: ptags,
        timestamp: cur_date,
        count: count
    });

    // Make an upsert (Update, if available, otherwise insert new)
    mongodb.collection('log_daily').update({
        tags: ptags,
        day: cur_date.getDate(),
        month: cur_date.getMonth(),
        year: cur_date.getYear()
    }, { $inc: { count: count } }, true);
    mongodb.collection('log_monthly').update({
        tags: ptags,
        month: cur_date.getMonth(),
        year: cur_date.getYear()
    }, { $inc: { count: count } }, true);
    mongodb.collection('log_yearly').update({
        tags: ptags,
        year: cur_date.getYear()
    }, { $inc: { count: count } }, true);
    mongodb.collection('log_monthly').update({
        tags: ptags
    }, { $inc: { count: count } }, true);

    var tagString = undefined;
    for(var i=0; i<ptags.length; i++) {
        if (!tagString)
            tagString = ptags[i];
        else
            tagString = tagString + ':' + ptags[i];

        if (liveListener[tagString] >= 0) {
            liveListener[tagString]++;
            console.log(liveListener[tagString])
            io.sockets.in(util.format('live-%s', tagString)).emit('liveUpdate', { value: tagString, count: liveListener[tagString] });
            setTimeout(liveCountdown, 1000, tagString);
        }
    }

    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Logged');
}).listen(8080, function() {
    console.log("Logging http server listening on port " + 8080);
});

