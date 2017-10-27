# Whitelister

Simple, **dependency-free** filtering and validation tool for Node.js and the browser.

[![Build Status](https://travis-ci.org/SpireTeam/whitelister.svg?branch=master)](https://travis-ci.org/SpireTeam/whitelister)

## Quick Start

#### Node.js

Using yarn:

`yarn add whitelister@latest`

Using npm:

`npm i --save whitelister@latest`

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

#### Browser

```html
<script src="https://unpkg.com/whitelister@latest/dist/whitelister.js" />
# or the minified version
<script src="https://unpkg.com/whitelister@latest/dist/whitelister.min.js" />

<script>
  var rules = {
    q: 'string',
    page: { type: 'integer', min: 1, default: 1 },
    per_page: { type: 'integer', min: 1, max: 100, default: 20 },
  };

  var params = { q: 'hello' };

  var result = whitelister.sync(rules, params);
</script>
```

## Documentation

You can find the full documentation on the website: [https://spireteam.github.io/whitelister/](https://spireteam.github.io/whitelister/)

## License

MIT

## Changelog

### v0.0.5
#### Oct. 25, 2017
* Ignore non-required properties with `undefined` values
* Treat external errors differently than internal errors

### v0.0.4
#### Oct. 16, 2017
* Ensure that `type` is treated like other `attributes`