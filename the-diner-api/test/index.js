'use-strict';

var sinon = require('sinon'),
	express = require('express'),
	app = express(),
	server,
	port = process.env.PORT || 3000;

before(function(cb){
	this.ordersBaseURI = '/orders';
	app.use(this.ordersBaseURI, newRouteFor.order({
		display: function(){return currentOrderSystem.display.apply(currentOrderSystem, arguments);}
	}))
	.listen(port, function(){
		server = this;
		// Note: arguments contain arguments passed to this function
		cb.apply(this, arguments);
	});
});

after(function(cb){
	if (!server) {
		return setImmediate(cb);
	}
	server.close(cb);
});

beforeEach(function(){
	currentOrderSystem = {
		display: sinon.stub();
	};
	this.orderSystem = currentOrderSystem;
});