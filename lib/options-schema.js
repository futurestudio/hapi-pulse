'use strict'

const Joi = require('joi')

module.exports = Joi.object({
  signals: Joi.alternatives(
    Joi.array().items(
      Joi.string().description('Shutdown signal')
    ).min(1).description('Shutdown signals to listen on for gracefully stop the hapi server'),
    Joi.string().description('Shutdown signal')
  ),
  logger: Joi.object(),
  preServerStop: Joi.func(),
  postServerStop: Joi.func(),
  preShutdown: Joi.func()
}).unknown(true)
