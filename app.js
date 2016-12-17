const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(require('serve-favicon')(path.join(__dirname, 'public/images/logo.png')));
app.use(require('morgan')('dev'));
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(require('serve-static')(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
  app.use(require('errorhandler')());
}

// Pages
app.get('/', (req, res) => {
  res.sendFile('app.html', { root: __dirname });
});

http.createServer(app).listen(app.get('port'), () => {
  console.log(`Express server listening on port ${app.get('port')}`);
});
