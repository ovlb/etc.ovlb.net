const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var env = process.env.NODE_ENV || 'env';

const routes = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /dist
app.use(favicon(path.join(__dirname, 'dist/img', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', routes);

if(env === 'env') {
  app.listen(4000, () => {
    console.log('listening on 4000 in mode ' +  env);
  });
} else {
  // uberspace port
  app.listen(61097, () => {
    console.log('listening in mode' + env + ' on port 61097');
  });
}

