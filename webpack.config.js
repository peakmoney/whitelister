const path = require('path');

module.exports = {
  entry: './whitelister.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'whitelister.js',
    library: 'whitelister',
    libraryTarget: 'umd',
  },
};
