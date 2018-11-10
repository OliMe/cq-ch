const rp = require('request-promise-native')
const fse = require('fs-extra')
const _ = require('lodash')
const commonConfig = require('./webpack/common')
const frontBackboneEs5Config = require('./webpack/front-backbone-es5')
const frontReactConfig = require('./webpack/front-react')

module.exports = function() {
  const configs = [frontReactConfig, frontBackboneEs5Config]

  return configs.map(config => _.merge({}, commonConfig, config))
};
