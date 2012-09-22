var express = require('express'),
    http = require('http'),
    path = require('path');

var app = express();

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.use(express.favicon(__dirname + '/public/images/logo.png'));
  app.use(express.logger('dev'));
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
  app.use(express.errorHandler());
});

//Pages
app.get('/', function (req, res) {
  res.sendfile('app.html');
});

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});