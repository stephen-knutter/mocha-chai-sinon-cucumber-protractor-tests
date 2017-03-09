var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var orders = require('./routes/orders');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var orderSystemWith = require('./public/javascripts/orders');

function inMemoryDAO(data) {
	return {
		byId: function(id, cb) {
			setImmediate(function() {
				cb(null, data[id]);
			});
		},
		update: function (entity, cb) {
			setImmediate(function() {
				data[entity.id] = entity.data;
				cb(null);
			})
		}
	}
}

var order = {},
	message = {},
	orderSystem = orderSystemWith({
		order: inMemoryDAO(order),
		message: inMemoryDAO(message)
	});

order['1'] = [
	{beverage: {beverage: 'Frapuccino', price: 4, id: 'b1'}, quantity: 2},
	{beverage: {beverage: 'Mocaccino', price: 2.3, id: 'b2'}, quantity: 1},
	{beverage: {beverage: 'Expresso', price: 1.5, id: 'b3'}, quantity: 1}
];

message['1'] = [
	{key: "error.beverage.notExists"},
	{key: "error.quantity", params: [-1]}
];

app.use('/', index);
app.use('/users', users);
app.use('/orders', orders(orderSystem));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
