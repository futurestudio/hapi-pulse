'use strict'

function noop () {
  return Promise.resolve()
}

function register (server, options) {
  const {
    signals = ['SIGINT', 'SIGTERM'],
    logger = console,
    preServerStop = noop,
    postServerStop = noop,
    preShutdown = noop,
    ...hapiOptions
  } = options

  if (!Array.isArray(signals)) {
    throw new Error('"signals" option must be a SIGNALs array')
  }

  async function shutdown () {
    try {
      await preServerStop()
      await server.stop(hapiOptions)
      await postServerStop()
      await preShutdown()

      signals.forEach(signal => process.removeListener(signal, shutdown))

      return process.exit(0)
    } catch (error) {
      logger.error('Error during server shutdown', error)
      return process.exit(1)
    }
  }

  signals.forEach(signal => process.on(signal, shutdown))
}

exports.plugin = {
  register,
  once: true,
  pkg: require('../package.json')
}
