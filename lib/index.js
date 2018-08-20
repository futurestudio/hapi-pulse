'use strict'

function register (server, options) {
  async function shutdown () {
    await server.stop(options)
    return process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

exports.plugin = {
  register,
  once: true,
  pkg: require('../package.json')
}
