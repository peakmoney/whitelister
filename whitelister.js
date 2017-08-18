/**
 * (c) 2017-present Spire Labs, LLC
*/
const moment = require('moment');

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

class ValidationFailed extends Error {
  constructor(field, validationMessage) {
    super();
    this.code = 400;
    this.message = 'Validation Failed';
    this.validation = {};
    this.validation[field] = [validationMessage];
  }
}

const parseRelativeDate = (instructions, name) => {
  if (typeof instructions !== 'string') {
    throw new ValidationFailed(name, `Invalid relative date: ${instructions}`);
  }

  if (instructions === 'now') {
    return moment();
  }
  const instrArray = instructions.split(' ');
  if (instrArray.length !== 3) {
    throw new ValidationFailed(name, `Invalid relative date: ${instructions}`);
  }

  if (instrArray[0] === 'subtract') {
    return moment().subtract(parseInt(instrArray[1], 10), instrArray[2]);
  } else if (instrArray[0] === 'add') {
    return moment().add(parseInt(instrArray[1], 10), instrArray[2]);
  }

  throw new ValidationFailed(name, `Invalid relative date: ${instructions}`);
};

function filterByRules(rules, params, parent) {
  if (!isObject(rules)) {
    throw new ValidationFailed('rules', 'is not an object');
  }

  if (!isObject(params)) {
    throw new ValidationFailed(parent, 'is not an object');
  }

  const filteredParams = {};

  Object.keys(rules).forEach((name) => {
    const value = rules[name];
    const properName = parent ? (`${parent}[${name}]`) : name;
    const opts = isString(value) ? { type: value } : (value || {});
    let val;
    if (has.call(params, name)) {
      val = params[name];
      if (val === null && (opts.allowNull || opts.type === 'null')) {
        filteredParams[name] = val;
      } else if (isNil(val) && opts.required) {
        throw new ValidationFailed(name, 'is required');
      } else {
        switch (opts.type) {
          case 'integer': {
            if (!Number.isInteger(val)) {
              val = parseInt(val, 10);
            }

            if (isNaN(val)) {
              throw new ValidationFailed(name, 'is not an integer');
            }

            if (isDefined(opts.max) && val > opts.max) {
              throw new ValidationFailed(name, `is too large (max ${opts.max})`);
            } else if (isDefined(opts.min) && val < opts.min) {
              throw new ValidationFailed(name, `is too small (max ${opts.min})`);
            }
            break;
          }
          case 'float': {
            val = parseFloat(val, 10);

            if (isNaN(val)) throw new ValidationFailed(name, 'is not a float');

            if (isDefined(opts.max) && val > opts.max) {
              throw new ValidationFailed(name, `is too large (max ${opts.max})`);
            } else if (isDefined(opts.min) && val < opts.min) {
              throw new ValidationFailed(name, `is too small (max ${opts.min})`);
            }
            break;
          }
          case 'array': {
            if (typeof val === 'string') {
              val = val.split(',').map(v => v.trim());
            } else if (isDefined(val) && !Array.isArray(val)) {
              throw new ValidationFailed(name, 'is not an array');
            }

            if (isDefined(opts.minLength) && (!isDefined(val) || val.length < opts.minLength)) {
              throw new ValidationFailed(name, `has too few elements (min ${opts.minLength} elements)`);
            }

            if (!isDefined(rules[name].attributes)) {
              const arr = [];
              for (let i = 0; i < val.length; i += 1) {
                arr.push(filterByRules(rules[name].attributes, val[i], `${properName}[${i}]`));
              }
              val = arr;
            }
            break;
          }
          case 'boolean': {
            if (['true', '1', 't'].includes(`${val}`.toLowerCase())) {
              val = true;
            } else if (['false', '0', 'f'].includes(`${val}`.toLowerCase())) {
              val = false;
            } else if (isDefined(val)) {
              throw new ValidationFailed(name, 'is not true or false');
            }
            break;
          }
          case 'string': {
            if (isDefined(val)) {
              val = val.toString();
              if (opts.minLength && val.trim().length < opts.minLength) {
                throw new ValidationFailed(name, `is too short (min ${opts.minLength} characters)`);
              } else if (opts.maxLength && val.trim().length > opts.maxLength) {
                throw new ValidationFailed(name, `is too long (max ${opts.maxLength} characters)`);
              }
            }

            break;
          }
          case 'date': {
            if (isNil(val)) {
              if (opts.required) throw new ValidationFailed(name, 'is required');
            } else {
              if (opts.format && !moment(val, opts.format).isValid()) {
                throw new ValidationFailed(name, `invalid format, expected ${opts.format}`);
              }

              const valMoment = opts.format ? moment(val, opts.format) : moment(val);

              if (!valMoment.isValid()) {
                throw new ValidationFailed(name, 'is invalid');
              }

              if (opts.before && !valMoment.isBefore(parseRelativeDate(name, opts.before))) {
                throw new ValidationFailed(name, 'is invalid (too late)');
              }

              if (opts.after && !valMoment.isAfter(parseRelativeDate(name, opts.after))) {
                throw new ValidationFailed(name, 'is invalid (too early)');
              }

              if (opts.parse !== false) {
                val = valMoment.toDate();
              }
            }

            break;
          }
          case 'email': {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line

            if (!re.test(val)) throw new ValidationFailed(name, 'is not a valid email address');
            break;
          }
          case 'object': {
            if ((isNil(val) || Object.keys(val).length < 1) && opts.required) {
              throw new ValidationFailed(name, 'is required');
            }

            if (!isObject(val)) {
              throw new ValidationFailed(name, 'is not an object');
            }

            if (Array.isArray(rules[name].require_one_of)
            && !includesOneOf(rules[name].require_one_of, Object.keys(val))) {
              const oneOf = rules[name].require_one_of.join(', ');
              throw new ValidationFailed(name, `must include one of ${oneOf}`);
            }

            val = filterByRules(rules[name].attributes, val, properName);
            break;
          }
          default: {
            if (!isString(val) && !Number.isInteger(val)) {
              throw new ValidationFailed(name, 'must be a string or number');
            }
          }
        }

        const validValue = acceptedValues =>
          acceptedValues.some((acceptedValue) => {
            if (typeof acceptedValue === 'function') return acceptedValue(val);
            return acceptedValue === val;
          });

        if (Array.isArray(opts.accepted_values) && !validValue(opts.accepted_values)) {
          throw new ValidationFailed(name, `must be one of ${opts.accepted_values.join(', ')}`);
        }

        filteredParams[name] = val;
      }
    } else if (isDefined(opts.default)) {
      filteredParams[name] = opts.default;
    } else if (opts.required) {
      throw new ValidationFailed(name, 'is required');
    }
  });

  return filteredParams;
}

module.exports = filterByRules;
