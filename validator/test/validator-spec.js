var chai = require('chai')
    expect = chai.expect,
    factoryWithConfiguration = require('../lib/factory');

describe('A Validator', () => {
  var validator, configuration;
  context('using the default validation rules:', () => {
    beforeEach(function() {
      configuration = function() {
        configuration.callCount++;
        configuration.args = Array.prototype.slice.call(arguments);
        return [
          {type: 'nonPositive'},
          {type: 'nonDivisible', options: {divisor: 3, error: 'error.three'}},
          {type: 'nonDivisible', options: {divisor: 5, error: 'error.five'}}
        ];
      };
      configuration.callCount = 0;
      var newValidator = factoryWithConfiguration(configuration);
      validator = newValidator('default');
    });

    context('using the alternative validation rules:', () => {
      beforeEach(function() {
        configuration = function() {
          configuration.callCount++;
          configuration.args = Array.prototype.slice.call(arguments);
          return [
            {type: 'nonPositive'},
            {type: 'nonDivisible', options: {divisor: 11, error: 'error.elven'}}
          ];
        };
        configuration.callCount = 0;
        var newValidator = factoryWithConfiguration(configuration);
        validator = newValidator('alternative');
      });
    });

    it('will access the configuration to get the validation rules', () => {
      expect(configuration.callCount).to.be.equal(1);
      expect(configuration.args).to.be.deep.equal(['default']);
    });

    it('will return no errors for valid numbers', () => {
      expect(validator(7)).to.be.empty;
    });

    context('for not strictly positive numbers:', () => {
      it('like 0, will include error.nonpositive', () => {
        expect(validator(0)).to.include('error.nonpositive');
      });

      it('like -2, will include error.nonpositive', () => {
        expect(validator(-2)).to.include('error.nonpositive');
      });
    });

    context('for numbers divisible by 3:', () => {
      it('like 3, will include error.three', () => {
        expect(validator(3)).to.include('error.three');
      });

      it('like 15, will include error.three', () => {
        expect(validator(15)).to.include('error.three');
      });
    });

    context('for numbers divisible by 5:', () => {
      it('like 5, will include error.five', () => {
        expect(validator(5)).to.include('error.five');
      });

      it('like 15, will include error.five', () => {
        expect(validator(15)).to.include('error.five');
      });
    });

  });
});
