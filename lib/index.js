'use strict'

const Joi = require('joi')
const Schema = require('./options-schema')
const ShutdownHandler = require('./lifecycle-handler')

function register (server, options) {
  Joi.assert(options, Schema)

  return new ShutdownHandler(server, options)
}

exports.plugin = {
  register,
  once: true,
  pkg: require('../package.json')
}
