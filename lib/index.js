'use strict'

function register (server, options) {
  process.on('SIGINT', async () => {
    await server.stop(options)
    return process.exit(0)
  })
}

exports.plugin = {
  register,
  pkg: require('../package.json')
}
