var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  HOST: 'http://b9088.com',
  NAME: 'Jaguar Dashboard'
})
