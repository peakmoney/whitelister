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

  describe('type: null', () => {
    it('should require a key with a null value', (done) => {
      const rules = {
        user: {
          type: 'object',
          required: true,
          attributes: {
            secret_password: { type: 'null', required: true },
          },
        },
      };
      const params = { user: { secret_password: 'P@ssw0rd' } };
      expect(() => whitelister(rules, params)).to.throw(WhitelistError, 'secret_password must be null');
      done();
    });

    it('should return an object where user.secret_password is null', (done) => {
      const rules = {
        user: {
          type: 'object',
          required: true,
          attributes: {
            secret_password: { type: 'null', required: true },
          },
        },
      };
      const params = { user: { secret_password: null } };
      const response = whitelister(rules, params);
      expect(response).to.be.an('object').that.has.property('user').that.has.property('secret_password', null);
      done();
    });
  });

  describe('type: integer', () => {
    it('should throw an error if value is "hello"', (done) => {
      const rules = { user_id: { type: 'integer' } };
      const params = { user_id: 'hello' };
      expect(() => whitelister(rules, params)).to.throw(WhitelistError, 'user_id is not an integer');
      done();
    });

    it('should parse "100" to integer', (done) => {
      const rules = { user_id: { type: 'integer' } };
      const params = { user_id: '100' };
      expect(whitelister(rules, params)).to.be.an('object').that.has.property('user_id', 100);
      done();
    });

    it('should accept 9999', (done) => {
      const rules = { user_id: { type: 'integer' } };
      const params = { user_id: 9999 };
      expect(whitelister(rules, params)).to.be.an('object').that.has.property('user_id', 9999);
      done();
    });

    it('should throw an error if value is above 10', (done) => {
      const rules = { user_id: { type: 'integer', max: 10 } };
      const params = { user_id: 11 };
      expect(() => whitelister(rules, params)).to.throw(WhitelistError, 'user_id is too large (max 10)');
      done();
    });

    it('should throw an error if value is below 10', (done) => {
      const rules = { user_id: { type: 'integer', min: 10 } };
      const params = { user_id: 9 };
      expect(() => whitelister(rules, params)).to.throw(WhitelistError, 'user_id is too small (min 10)');
      done();
    });
  });

  describe('type: float', () => {
    it('should throw an error if value is "hello"', (done) => {
      const rules = { amount: { type: 'float' } };
      const params = { amount: 'hello' };
      expect(() => whitelister(rules, params)).to.throw(WhitelistError, 'amount is not a float');
      done();
    });

    it('should parse "99.9" to float', (done) => {
      const rules = { amount: { type: 'float' } };
      const params = { amount: '99.9' };
      expect(whitelister(rules, params)).to.be.an('object').that.has.property('amount', 99.9);
      done();
    });

    it('should accept 88.8', (done) => {
      const rules = { amount: { type: 'float' } };
      const params = { amount: 88.8 };
      expect(whitelister(rules, params)).to.be.an('object').that.has.property('amount', 88.8);
      done();
    });

    it('should throw an error if value is above 44.4', (done) => {
      const rules = { amount: { type: 'float', max: 44.4 } };
      const params = { amount: 44.6 };
      expect(() => whitelister(rules, params)).to.throw(WhitelistError, 'amount is too large (max 44.4)');
      done();
    });

    it('should throw an error if value is below 44.4', (done) => {
      const rules = { amount: { type: 'float', min: 44.4 } };
      const params = { amount: 44.2 };
      expect(() => whitelister(rules, params)).to.throw(WhitelistError, 'amount is too small (min 44.4)');
      done();
    });
  });

  describe('rule: allowNull', () => {
    const rules = { name: { type: 'string', allowNull: true } };
    it('should return an object with property: null', (done) => {
      const response = whitelister(rules, { name: null });
      expect(response).to.be.an('object').that.has.property('name', null);
      done();
    });
  });
});
