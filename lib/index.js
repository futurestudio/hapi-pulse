'use strict'

const ShutdownHandler = require('./shutdown-handler')

function register (server, options) {
  return new ShutdownHandler(server, options)
}

exports.plugin = {
  register,
  once: true,
  pkg: require('../package.json')
}
