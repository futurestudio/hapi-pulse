'use strict'

class Shutdown {
  constructor (server, options) {
    const {
      signals = ['SIGINT', 'SIGTERM'],
      logger = console,
      preServerStop = this.noop,
      postServerStop = this.noop,
      preShutdown = this.noop,
      ...shutdownOptions
    } = options

    this.server = server
    this.logger = logger
    this.preShutdown = preShutdown
    this.preServerStop = preServerStop
    this.postServerStop = postServerStop
    this.shutdownOptions = shutdownOptions
    this.signals = Array.isArray(signals) ? signals : [signals]

    this.addListener()
  }

  async noop () {
    return Promise.resolve()
  }

  async shutdown () {
    try {
      await this.preServerStop()
      await this.serverStop()
      await this.postServerStop()
      await this.preShutdown()

      this.removeListener()

      return process.exit(0)
    } catch (error) {
      this.removeListener()

      this.logger.error('Error during server shutdown:', error)
      return process.exit(1)
    }
  }

  async serverStop () {
    await this.server.stop(this.shutdownOptions)
  }

  addListener () {
    this.signals.forEach(signal => process.on(signal, async () => {
      await this.shutdown()
    }))
  }

  removeListener () {
    this.signals.forEach(signal => process.removeListener(signal, async () => {
      await this.shutdown()
    }))
  }
}

module.exports = Shutdown
