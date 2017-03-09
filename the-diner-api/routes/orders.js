var express = require('express');
var router = express.Router();
var orderAsHAL = require('../lib/order2hal');
var placeOrderFormAsHAL = require('../lib/placeOrderForm2hal');
var createFormAsHAL = require('../lib/createForm2hal');

function actionNamed(actionName) {
	return function(actionModel) {
		return actionModel.action === actionName;
	}
}

function sendResponse(res, halPayload) {
	return function(data) {
		if (!data)
			return res.status(404).end();
		
		res.format({
			json: function() {
				res.send(data);
			},
			'application/hal+json': function() {
				res.send(halPayload(data));
			}
		})
	}
}

function sendError(res) {
	return function(err) {
		res.status(500).send({
			error: err.message
		}).end();
	}
}

module.exports = function(orderSystem) {
	router.get('/:id', function(req, res, next) {
		var orderId = req.params.id;
		orderSystem
		.display(orderId)
		.then(sendResponse(res, function(order) {
			return orderAsHAL({
				uri: req.originalUrl,
				order: order
			});
		}))
		.fail(sendError(res));
	});

	router.get('/:id/place-order-form', function(req, res, next){
		var orderId = req.params.id;
		orderSystem
			.display(orderId)
			.then(function(order){
				return order && order.actions && order.actions.filter(actionNamed('place-order'))[0]
			})
			.then(sendResponse(res, function(action) {
				var uri = req.originalUrl;
				
				return placeOrderFormAsHAL({
					action: action,
					uri: uri,
					orderUri: uri.slice(0, uri.lastIndexOf('/place-order-form'))
				});
			}))
			.fail(sendError(res));
	});
	
	router.get('/:id/create-form', function(req, res, next) {
		var orderId = req.params.id;
		orderSystem
			.display(orderId)
			.then(function(order) {
				var action = order && order.actions && order.actions.filter(actionNamed('append-beverage'))[0];
				
				return action ? {
					action: action,
					items: order.items
				} : null;
			})
			.then(sendResponse(res, function(formData) {
				var uri = req.originalUrl;
				formData.uri = uri;
				formData.orderUri = uri.slice(0, uri.lastIndexOf('/create-form'));
				
				return createFormAsHAL(formData);
			}))
			.fail(sendError(res));
	});
	
	return router;
}


//module.exports = router;