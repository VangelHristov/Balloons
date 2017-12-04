'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var compression = require('compression');
var helmet = require('helmet');

var app = express();

app.use(helmet({hidePoweredBy: true}));
app.use(compression());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function catch404(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(function errorHandler(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.end('error');
});

module.exports = app;
