/* eslint-env node, mocha */

const whitelister = require('../lib/whitelister');
const { ArgumentError, WhitelistError } = require('../lib/errors');

const { expect } = require('chai');


describe('Whitelister', () => {
  it('should be a function', (done) => {
    expect(whitelister).to.be.a('function');
    done();
  });

  describe('basic errors', () => {
    it('should require rules as an argument', (done) => {
      expect(() => whitelister()).to.throw(ArgumentError, 'rules is not an object');
      done();
    });

    it('should require rules (an object) as first argument', (done) => {
      expect(() => whitelister('rules')).to.throw(ArgumentError, 'rules is not an object');
      done();
    });

    it('should require params as a second argument', (done) => {
      expect(() => whitelister({})).to.throw(ArgumentError, 'params is not an object');
      done();
    });

    it('should require params (an object) as a second argument', (done) => {
      expect(() => whitelister({}, 'params')).to.throw(ArgumentError, 'params is not an object');
      done();
    });
  });

  describe('basic usage', () => {
    it('should return an empty object when rules are empty', (done) => {
      const rules = {};
      const params = {};
      const response = whitelister(rules, params);
      expect(response).to.be.an('object');
      expect(Object.keys(response)).to.have.lengthOf(0);
      done();
    });

    it('should return an empty object when params are empty', (done) => {
      const rules = {
        name: 'string',
      };
      const params = {};
      const response = whitelister(rules, params);
      expect(response).to.be.an('object');
      expect(Object.keys(response)).to.have.lengthOf(0);
      done();
    });

    it('should return an empty object when params have non-whitelisted props', (done) => {
      const rules = {
        name: 'string',
      };
      const params = {
        email: 'bob@email.com',
      };
      const response = whitelister(rules, params);
      expect(response).to.be.an('object');
      expect(Object.keys(response)).to.have.lengthOf(0);
      done();
    });

    it('should return an object with "name" prop', (done) => {
      const rules = {
        name: 'string',
      };
      const params = {
        email: 'bob@email.com',
        name: 'Bob Smith',
      };
      const response = whitelister(rules, params);
      expect(response).to.be.an('object');
      expect(response).to.have.property('name', 'Bob Smith');
      done();
    });

    it('should throw when missing required prop', (done) => {
      const rules = {
        name: 'string',
        id: { type: 'integer', required: true },
      };
      const params = {
        email: 'bob@email.com',
        name: 'Bob Smith',
      };
      expect(() => whitelister(rules, params)).to.throw(WhitelistError, 'id is required');
      expect(() => whitelister(rules, params)).to.throw(WhitelistError)
        .with.property('whitelist')
        .that.is.an('object')
        .that.has.property('id', 'is required');
      done();
    });
  });
});
