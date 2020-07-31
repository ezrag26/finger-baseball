const path = require('path')

module.exports = {
  entry: "./site/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main_bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: { loader: 'babel-loader' },
        exclude: /node_modules/
      }
    ]
  }
}