const { ArgumentError, WhitelistError } = require('./errors');
const {
  has,
  includesOneOf,
  isDefined,
  isFunc,
  isNil,
  isObject,
  isString,
} = require('./helpers');

const filters = {
  config: {
    nestedNames: true,
  },

  setConfig: (opts = {}) => {
    if (isDefined(opts.nestedNames)) {
      filters.config.nestedNames = opts.nestedNames;
    }
  },
};

filters.byRules = function filterByRules(rules, params, parent) {
  if (!isObject(rules) && !isString(rules) && !isFunc(rules)) {
    throw new ArgumentError('rules', 'is not an object or string');
  }

  function filterByType(type, opts, target, parentName = '') {
    if (!has.call(filters, type)) {
      throw new ArgumentError(`${parentName}.${type}`, 'is invalid');
    }

    const filter = filters[type];
    return filter(opts, target, parentName);
  }

  if (isString(rules)) {
    return filterByType(rules, {}, params, parent);
  }

  if (isFunc(rules)) {
    if (!rules(params)) {
      throw new WhitelistError(`${parent || 'value'}`, 'is invalid');
    }
    return params;
  }

  if (has.call(rules, 'type')) {
    const val = (has.call(rules, 'preTransform') && isFunc(rules.preTransform)) ?
      rules.preTransform(params) : params;
    return filterByType(rules.type, rules, val, parent);
  }

  const filteredParams = {};

  Object.keys(rules).forEach((name) => {
    const rule = rules[name] || {};
    const properName = (filters.config.nestedNames && parent) ? `${parent}[${name}]` : name;

    let val;
    if (isString(rule) && has.call(params, name)) {
      val = params[name];
      filteredParams[name] = filterByType(rule, {}, val, properName);
    } else if (isFunc(rule)) {
      val = params[name];
      if (!rule(val)) {
        throw new WhitelistError(properName, 'is invalid');
      }
      filteredParams[name] = val;
    } else if (has.call(params, name)) {
      val = params[name];
      if (val === null && (rule.allowNull || rule.type === 'null')) {
        filteredParams[name] = val;
      } else if (isNil(val) && rule.required) {
        throw new WhitelistError(properName, 'is required');
      } else if (!has.call(filters, rule.type) && !isFunc(rule.filterWith)) {
        throw new ArgumentError(`${properName}.type`, 'is invalid');
      } else {
        const filter = has.call(filters, rule.type) ? filters[rule.type] : rule.filterWith;
        if (has.call(rule, 'preTransform') && isFunc(rule.preTransform)) {
          val = rule.preTransform(val);
        }
        val = filter(rule, val, properName);

        const validValue = acceptedValues =>
          acceptedValues.some((acceptedValue) => {
            if (typeof acceptedValue === 'function') return acceptedValue(val);
            return acceptedValue === val;
          });

        if (Array.isArray(rule.acceptedValues) && !validValue(rule.acceptedValues)) {
          throw new WhitelistError(properName, `must be one of ${rule.acceptedValues.join(', ')}`);
        }

        if (isFunc(rule.filterWith) && !rule.filterWith(val)) {
          throw new WhitelistError(properName, 'is invalid');
        }

        filteredParams[name] = (has.call(rule, 'postTransform') && isFunc(rule.postTransform)) ?
          rule.postTransform(val) : val;
      }
    } else if (isDefined(rule.default)) {
      filteredParams[name] = rule.default;
    } else if (rule.required) {
      throw new WhitelistError(name, 'is required');
    }
  });

  return filteredParams;
};

filters.array = function filterArray(rules, target, parentName) {
  const val = isString(target) ? target.split(',').map(t => t.trim()) : target;
  if (isDefined(val) && !Array.isArray(val)) {
    throw new WhitelistError(parentName, 'is not an array');
  }

  if (isDefined(rules.minLength) && (!isDefined(val) || val.length < rules.minLength)) {
    throw new WhitelistError(parentName, `has too few elements (min ${rules.minLength} elements)`);
  }

  if (isDefined(rules.maxLength) && (isDefined(val) && val.length > rules.maxLength)) {
    throw new WhitelistError(parentName, `has too many elements (max ${rules.maxLength} elements)`);
  }

  const rule = rules.attributes;
  if (isDefined(rule)) {
    return val.map((child, i) => filters.byRules(rule, child, `${parentName}[${i}]`));
  }
  return val;
};

filters.boolean = function filterBoolean(rules, target, name) {
  let val = target;
  if (['true', '1', 't'].includes(`${val}`.toLowerCase())) {
    val = true;
  } else if (['false', '0', 'f'].includes(`${val}`.toLowerCase())) {
    val = false;
  } else if (isDefined(val)) {
    throw new WhitelistError(name, 'is not true or false');
  }
  return val;
};

filters.email = function filterEmail(rules, target, name) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line

  if (!re.test(target)) throw new WhitelistError(name, 'is not a valid email address');

  return target;
};

filters.null = function filterNull(rules, target, name) {
  if (target !== null) {
    throw new WhitelistError(name, 'must be null');
  }
  return target;
};

filters.integer = function filterInteger(rules, target, name) {
  let val = target;
  if (!Number.isInteger(val)) {
    val = parseInt(val, 10);
  }
  if (isNaN(val)) {
    throw new WhitelistError(name, 'is not an integer');
  }
  if (isDefined(rules.max) && val > rules.max) {
    throw new WhitelistError(name, `is too large (max ${rules.max})`);
  } else if (isDefined(rules.min) && val < rules.min) {
    throw new WhitelistError(name, `is too small (min ${rules.min})`);
  }
  return val;
};

filters.float = function filterFloat(rules, target, name) {
  const val = parseFloat(target, 10);
  if (isNaN(val)) throw new WhitelistError(name, 'is not a float');
  if (isDefined(rules.max) && val > rules.max) {
    throw new WhitelistError(name, `is too large (max ${rules.max})`);
  } else if (isDefined(rules.min) && val < rules.min) {
    throw new WhitelistError(name, `is too small (min ${rules.min})`);
  }
  return val;
};

filters.object = function filterObject(rules, target, parentName) {
  if ((isNil(target) || Object.keys(target).length < 1) && rules.required) {
    throw new WhitelistError(parentName, 'is required');
  }

  if (!isObject(target)) {
    throw new WhitelistError(parentName, 'is not an object');
  }

  if (Array.isArray(rules.requireOneOf)
  && !includesOneOf(rules.requireOneOf, Object.keys(target))) {
    const oneOf = rules.requireOneOf.join(', ');
    throw new WhitelistError(parentName, `must include one of ${oneOf}`);
  }

  if (has.call(rules, 'attributes')) {
    const name = filters.config.nestedNames ? parentName : '';
    return filters.byRules(rules.attributes, target, name);
  }

  return target;
};

filters.string = function filterString(rules, target, name) {
  let val;
  if (isDefined(target)) {
    if (!isString(target)) {
      throw new WhitelistError(name, 'is not a string');
    }
    val = target.toString();
    if (rules.minLength && val.trim().length < rules.minLength) {
      throw new WhitelistError(name, `is too short (min ${rules.minLength} characters)`);
    } else if (rules.maxLength && val.trim().length > rules.maxLength) {
      throw new WhitelistError(name, `is too long (max ${rules.maxLength} characters)`);
    }
    return val;
  }
  if (rules.required && !isDefined(val)) throw new WhitelistError(name, 'is not a string');
  return val;
};

module.exports = (rules, target) => filters.byRules(rules, target);

module.exports.setConfig = (opts = {}) => {
  filters.setConfig(opts);
};
