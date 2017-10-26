const path = require('path');

module.exports = {
  entry: './whitelister.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
          },
        },
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'whitelister.js',
    library: 'whitelister',
    libraryTarget: 'umd',
  },
};
