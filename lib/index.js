'use strict'

const Joi = require('@hapi/joi')
const Schema = require('./options-schema')
const LifecycleHandler = require('./lifecycle-handler')

function register (server, options) {
  Joi.assert(options, Schema)

  const handler = new LifecycleHandler(server, options)
  handler.addListeners()
}

exports.plugin = {
  register,
  once: true,
  pkg: require('../package.json')
}
