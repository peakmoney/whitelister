/**
 * (c) 2017-present Spire Labs, LLC
*/
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

module.exports = {
  has,
  includesOneOf,
  isDefined,
  isNil,
  isObject,
  isString,
};
