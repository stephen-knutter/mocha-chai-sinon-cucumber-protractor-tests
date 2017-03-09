'use-strict';

var chai = require('chai');
var expect = chai.expect;
var Q = require('q');

chai.use(require("sinon-chai"));
chai.use(require("chai-as-promised"));

describe('GET /order/:orderId', function() {
	beforeEach(function() {
		this.orderId = "<order id>";
		this.orderURI = this.ordersBaseURI + '/' + encodeURIComponent(this.orderId);
		
		this.orderModel = {};
		this.orderSystem.display
			.withArgs(this.orderId)
			.returns(Q.fulfill(this.orderModel));
	});
	
	it('will respond with a 200 status code', function() {
		return expect(this.GET(this.orderURI)).to.eventually
			.have.property('status', 200);
	});
})