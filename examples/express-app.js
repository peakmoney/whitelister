const url = require('url');
const whitelister = require('../lib/whitelister');
const errors = require('../lib/errors');

function filterParams(params) {
  const givenParams = params || {};

  return function returnedFilterParams(req, res, next) {
    req.pause();

    const queryParams = req.query || url.parse(req.url, true).query;
    const providedParams = queryParams || {};

    function mergeParams(source) {
      const keys = Object.keys(source);
      for (let i = 0; i < keys.length; i += 1) {
        const pKey = keys[i];
        if (Object.prototype.hasOwnProperty.call(source, pKey)) {
          providedParams[pKey] = source[pKey];
        }
      }
    }

    if (req.body) mergeParams(req.body);

    mergeParams(req.params);

    return whitelister(givenParams, providedParams)
      .then((filteredParams) => {
        req.params = filteredParams;

        req.resume();

        next();
      })
      .catch((err) => {
        const [status, message] = err instanceof errors.BaseError ? [400, 'Invalid Params'] : [500, 'Internal Error'];

        req.resume();

        res.status(status).send(message);
      });
  };
}

const express = require('express');

const app = express();

app.get(
  '/',
  filterParams({
    page: { type: 'integer', min: 1, default: 1 },
    per_page: { type: 'integer', min: 1, max: 100, default: 1 },
  }),
  (req, res) => {
    const params = {
      page: req.params.page || 1,
      per_page: req.params.per_page || 1,
      message: 'Try appending "per_page=foo" to the URL',
    };
    res.json(params);
  });

app.listen(3000, () => {
  process.stdout.write('Express example app is listening on 3000');
});
