/* eslint-env node, mocha */

const whitelister = require('../whitelister');

const { expect } = require('chai');


describe('Whitelister', () => {
  it('should be a function', (done) => {
    expect(whitelister).to.be.a('function');
    done();
  });

  describe('basic errors', () => {
    it('should require rules as an argument', (done) => {
      expect(() => whitelister()).to.throw(/Validation/);
      done();
    });

    it('should require rules (an object) as first argument', (done) => {
      expect(() => whitelister('rules')).to.throw(/Validation/);
      done();
    });

    it('should require params as a second argument', (done) => {
      expect(() => whitelister({})).to.throw(/Validation/);
      done();
    });

    it('should require params (an object) as a second argument', (done) => {
      expect(() => whitelister({}, 'params')).to.throw(/Validation/);
      done();
    });
  });

  describe('basic usage', () => {
    const rules = {};
    const params = {};

    it('should return an empty object when rules are empty', (done) => {
      const response = whitelister(rules, params);
      expect(response).to.be.an('object');
      expect(Object.keys(response)).to.have.lengthOf(0);
      done();
    });

    it('should return an empty object when params are empty', (done) => {
      rules.name = 'string';
      const response = whitelister(rules, params);
      expect(response).to.be.an('object');
      expect(Object.keys(response)).to.have.lengthOf(0);
      done();
    });

    it('should return an empty object when params have non-whitelisted props', (done) => {
      params.email = 'bob@email.com';
      const response = whitelister(rules, params);
      expect(response).to.be.an('object');
      expect(Object.keys(response)).to.have.lengthOf(0);
      done();
    });

    it('should return an object with "name" prop', (done) => {
      params.name = 'Bob Smith';
      const response = whitelister(rules, params);
      expect(response).to.be.an('object');
      expect(response).to.have.property('name', 'Bob Smith');
      done();
    });

    it('should throw when missing required prop', (done) => {
      rules.id = { type: 'integer', required: true };
      expect(() => whitelister(rules, params)).to.throw(/Validation/);
      done();
    });
  });
});
