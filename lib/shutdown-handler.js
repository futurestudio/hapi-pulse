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

    this.addListeners()
  }

  /**
   * Just resolve.
   *
   * @returns {Promise}
   */
  async noop () {
    return Promise.resolve()
  }

  /**
   * Add listeners for the shutdown signals.
   */
  addListeners () {
    this.signals.forEach(signal => process.on(signal, () => {
      this.shutdown()
    }))
  }

  /**
   * Remove all shutdown listeners.
   */
  removeListeners () {
    this.signals.forEach(signal => process.removeAllListeners(signal))
  }

  /**
   * Gracefully shut down the server. Run
   * lifecycle hooks pre server-stop,
   * post server-stop and pre shutdown.
   */
  async shutdown () {
    try {
      await this.preServerStop()
      await this.serverStop()
      await this.postServerStop()
      await this.preShutdown()

      this.removeListeners()

      return process.exit(0)
    } catch (error) {
      this.removeListeners()
      this.logger.error('Error during server shutdown:', error)

      return process.exit(1)
    }
  }

  async serverStop () {
    await this.server.stop(this.shutdownOptions)
  }
}

module.exports = Shutdown
