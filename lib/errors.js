/**
 * (c) 2017-present Spire Labs, LLC
*/
module.exports.BaseError = class extends Error {
  constructor(msg) {
    super();
    this.name = 'BaseError';
    this.message = msg;
  }
};

module.exports.ArgumentError = class extends module.exports.BaseError {
  constructor(name, msg = '') {
    super();
    this.name = 'ArgumentError';
    const ending = msg.length > 0 ? ` ${msg}` : '';
    this.message = `${name}${ending}`;
  }
};

module.exports.WhitelistError = class extends module.exports.BaseError {
  constructor(field, msg = '') {
    super();
    this.name = 'WhitelistError';
    const ending = msg.length > 0 ? ` ${msg}` : '';
    this.message = `${field}${ending}`;
    this.whitelist = {
      [field]: msg,
    };
  }
};
