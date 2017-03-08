'use-strict';

var chai = require('chai');
var expect = chai.expect;
var Q = require('q');

chai.use(require("sinon-chai"));
chai.use(require("chai-as-promised"));

describe('GET /order/:orderId', function(){
	beforeEach(function(){
		this.orderId = "<order id>";
		this.orderURI = this.ordersBaseURI + '/' + encodeURIComponent(this.orderId);
	});
	
	context('The order exists', function(){
		beforeEach(function(){
			this.orderModel = {};
			this.orderSystem.display
				.withArgs(this.orderId)
				.returns(Q.fulfill(this.orderModel));
		});
		
		it('will respond with a 200 code');
		
		describe('will respond with a HAL document for the order', function(){
			//TODO: Implement Test
		});
	});
	
	context('The order does not exist', function(){
		beforeEach(function(){
			this.orderSystem.display
				.withArgs(this.orderId)
				.returns(Q.fulfill(null));
		});
		
		it('will respond with a 404 code');
	});
	
	context('The order subsystem is down', function(){
		beforeEach(function(){
			this.orderSystem.display
				.withArgs(this.orderId)
				.returns(Q.reject(new Error('Expected error')));
		});
		
		it('will respond with a 500 code');
	});
})