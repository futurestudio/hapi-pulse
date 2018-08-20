'use strict'

function noop () {
  return Promise.resolve()
}

function register (server, options) {
  const {
    signals = ['SIGINT', 'SIGTERM'],
    onSignal = noop
  } = options

  async function shutdown () {
    try {
      await server.stop(options)
      await onSignal()
      return process.exit(0)
    } catch (error) {
      console.log('Error during server shutdown', error)
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
