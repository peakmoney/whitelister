module.exports.BaseError = class extends Error {
  constructor(msg = '') {
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

module.exports.FieldError = class extends module.exports.BaseError {
  constructor(field, message = 'is invalid') {
    super();
    this.name = 'FieldError';
    this.field = field;
    this.message = message;
  }

  toString() {
    return `${this.field} ${this.message}`;
  }

  toJSON() {
    return {
      field: this.field,
      message: this.message,
    };
  }
};

module.exports.WhitelistError = class extends module.exports.BaseError {
  constructor(fieldErrors = []) {
    super();
    this.name = 'WhitelistError';
    this.errors = [];
    this.message = '';
    fieldErrors.forEach((err) => {
      if (err instanceof module.exports.WhitelistError) {
        err.errors.forEach((e) => {
          this.errors.push(e);
        });
        this.addToMessage(err.message);
      } else {
        this.errors.push(err.toJSON());
        this.addToMessage(err.toString());
      }
    });
  }

  addToMessage(msg) {
    if (this.message.length > 0) {
      this.message = `${this.message}, ${msg}`;
    } else {
      this.message = msg;
    }
  }
};
