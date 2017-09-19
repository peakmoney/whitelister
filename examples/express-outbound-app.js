const users = {
  1: { id: 1, name: 'David', email: 'david@spirelabs.co', password: 'P@$$w0Rd' },
  2: { id: 2, name: 'Rob', email: 'rob@spirelabs.co', password: '(@NaD@' },
};

const whitelister = require('../lib/whitelister');
const errors = require('../lib/errors');

const express = require('express');

const app = express();

app.get(
  '/',
  (req, res) => {
    res.status(200).send(`
      Hi, there! Try visiting "/users/1" or "/users/2".
    `);
  });

app.get(
  '/users/:id',
  (req, res) => {
    const user = users[req.params.id];
    if (user) {
      let status = 200;
      let response;
      try {
        // Whitelister will validate the response data and strip out "password" from each user.
        response = whitelister.sync({
          id: { type: 'integer', required: true, min: 1 },
          name: 'string',
          email: 'email',
        }, user);
      } catch (err) {
        status = 400;
        response = { error: 'Bad Request' };
      }

      res.status(status).json(response);
    } else {
      res.status(404).json({ error: 'User Not Found' });
    }
  });

app.listen(3000, () => {
  process.stdout.write('Express example app is listening on 3000');
});
