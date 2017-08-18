/**
 * (c) 2017-present Spire Labs, LLC
*/
const moment = require('moment');
const { ArgumentError } = require('./errors');

const toString = Object.prototype.toString;

const has = Object.prototype.hasOwnProperty;

const isDefined = obj => typeof obj !== 'undefined';

const isString = obj => toString.call(obj) === '[object String]';

const isObject = obj => toString.call(obj) === '[object Object]';

const isNil = obj => !isDefined(obj) || obj === null;

const includesOneOf = (expected, given) => {
  const [base, target] = expected.length < given.length ? [expected, given] : [given, expected];
  return base.some(val => target.includes(val));
};

const parseRelativeDate = (instructions, name) => {
  if (typeof instructions !== 'string') {
    throw new ArgumentError(name, `"${instructions}" is an invalid relative date`);
  }

  if (instructions === 'now') {
    return moment();
  }
  const instrArray = instructions.split(' ');
  if (instrArray.length !== 3) {
    throw new ArgumentError(name, `"${instructions}" is an invalid relative date`);
  }

  if (instrArray[0] === 'subtract') {
    return moment().subtract(parseInt(instrArray[1], 10), instrArray[2]);
  } else if (instrArray[0] === 'add') {
    return moment().add(parseInt(instrArray[1], 10), instrArray[2]);
  }

  throw new ArgumentError(name, `"${instructions}" is an invalid relative date`);
};

module.exports = {
  has,
  includesOneOf,
  isDefined,
  isNil,
  isObject,
  isString,
  parseRelativeDate,
};
