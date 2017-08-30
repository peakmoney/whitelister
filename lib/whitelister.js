/**
 * (c) 2017-present Spire Labs, LLC
*/
const { ArgumentError, WhitelistError } = require('./errors');
const {
  has,
  includesOneOf,
  isDefined,
  isNil,
  isObject,
  isString,
} = require('./helpers');

function filterByRules(rules, params, parent) {
  if (!isObject(rules)) {
    throw new ArgumentError('rules', 'is not an object');
  }

  if (!isObject(params)) {
    throw new ArgumentError('params', 'is not an object');
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
        throw new WhitelistError(name, 'is required');
      } else {
        switch (opts.type) {
          case 'null': {
            if (val !== null) {
              throw new WhitelistError(name, 'must be null');
            }
            break;
          }
          case 'integer': {
            if (!Number.isInteger(val)) {
              val = parseInt(val, 10);
            }

            if (isNaN(val)) {
              throw new WhitelistError(name, 'is not an integer');
            }

            if (isDefined(opts.max) && val > opts.max) {
              throw new WhitelistError(name, `is too large (max ${opts.max})`);
            } else if (isDefined(opts.min) && val < opts.min) {
              throw new WhitelistError(name, `is too small (min ${opts.min})`);
            }
            break;
          }
          case 'float': {
            val = parseFloat(val, 10);

            if (isNaN(val)) throw new WhitelistError(name, 'is not a float');

            if (isDefined(opts.max) && val > opts.max) {
              throw new WhitelistError(name, `is too large (max ${opts.max})`);
            } else if (isDefined(opts.min) && val < opts.min) {
              throw new WhitelistError(name, `is too small (min ${opts.min})`);
            }
            break;
          }
          case 'array': {
            if (typeof val === 'string') {
              val = val.split(',').map(v => v.trim());
            } else if (isDefined(val) && !Array.isArray(val)) {
              throw new WhitelistError(name, 'is not an array');
            }

            if (isDefined(opts.minLength) && (!isDefined(val) || val.length < opts.minLength)) {
              throw new WhitelistError(name, `has too few elements (min ${opts.minLength} elements)`);
            }

            if (isDefined(opts.maxLength) && (isDefined(val) && val.length > opts.maxLength)) {
              throw new WhitelistError(name, `has too many elements (max ${opts.maxLength} elements)`);
            }

            if (isDefined(rules[name].attributes)) {
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
              throw new WhitelistError(name, 'is not true or false');
            }
            break;
          }
          case 'string': {
            if (isDefined(val)) {
              if (!isString(val)) {
                throw new WhitelistError(name, 'is not a string');
              }
              val = val.toString();
              if (opts.minLength && val.trim().length < opts.minLength) {
                throw new WhitelistError(name, `is too short (min ${opts.minLength} characters)`);
              } else if (opts.maxLength && val.trim().length > opts.maxLength) {
                throw new WhitelistError(name, `is too long (max ${opts.maxLength} characters)`);
              }
            }

            break;
          }
          case 'email': {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line

            if (!re.test(val)) throw new WhitelistError(name, 'is not a valid email address');
            break;
          }
          case 'object': {
            if ((isNil(val) || Object.keys(val).length < 1) && opts.required) {
              throw new WhitelistError(name, 'is required');
            }

            if (!isObject(val)) {
              throw new WhitelistError(name, 'is not an object');
            }

            if (Array.isArray(opts.requireOneOf)
            && !includesOneOf(opts.requireOneOf, Object.keys(val))) {
              const oneOf = opts.requireOneOf.join(', ');
              throw new WhitelistError(name, `must include one of ${oneOf}`);
            }

            val = filterByRules(opts.attributes, val, properName);
            break;
          }
          default: {
            if (!isString(val) && !Number.isInteger(val)) {
              throw new WhitelistError(name, 'must be a string or number');
            }
          }
        }

        const validValue = acceptedValues =>
          acceptedValues.some((acceptedValue) => {
            if (typeof acceptedValue === 'function') return acceptedValue(val);
            return acceptedValue === val;
          });

        if (Array.isArray(opts.acceptedValues) && !validValue(opts.acceptedValues)) {
          throw new WhitelistError(name, `must be one of ${opts.acceptedValues.join(', ')}`);
        }

        filteredParams[name] = val;
      }
    } else if (isDefined(opts.default)) {
      filteredParams[name] = opts.default;
    } else if (opts.required) {
      throw new WhitelistError(name, 'is required');
    }
  });

  return filteredParams;
}

module.exports = filterByRules;
