# Whitelister

Simple, basic filtering and validation tool for Node.js.

## Quick Start

Using npm:

`npm i --save whitelister`

In Node.js
```js
const whitelister = require('whitelister');

const rules = {
  q: 'string',
  page: { type: 'integer', min: 1, default: 1 },
  per_page: { type: 'integer', min: 1, max: 100, default: 20 },
};

const params = { q: 'hello' };

return whitelister(rules, params);
// => { page: 1, per_page: 20, q: 'hello' };
```

## Documentation

You can find the full documentation on the website: [https://spireteam.github.io/whitelister/](https://spireteam.github.io/whitelister/)

## License

MIT