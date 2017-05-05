const path = require('path')

module.exports = {
  entry: './index.mjs',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js'
  }
}
