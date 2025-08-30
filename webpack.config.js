const path = require('path');

module.exports = {
  entry: './src/browser/vapi-client.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'vapi-client.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'VapiClient',
      type: 'umd'
    },
    globalObject: 'this'
  },
  mode: 'development',
  devtool: 'source-map'
};