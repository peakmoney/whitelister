const whitelister = require('../lib/whitelister');

const rules = {
  name: { type: 'string', required: true },
  birthday: {
    type: 'string',
    required: true,
    filterWith: (val) => {
      // make sure that the given birthday goes back at least 18 years
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setDate(eighteenYearsAgo.getDate() - (18 * 365));
      const diffDays = Math.ceil(
        Math.abs(
          eighteenYearsAgo.getTime() - new Date(val).getTime()) / (1000 * 3600 * 24));

      return diffDays >= (365 * 18);
    },
  },
};

const params = {
  name: 'David',
  birthday: '01/01/2009',
};

let res;
try {
  res = whitelister.sync(rules, params);
} catch (e) {
  // should be an error saying that birthday is invalid
  console.error('Throwing an error, this is expected! :)', e.stack || e);
}

if (res) {
  console.log('This should be undefined');
}

process.exit();
