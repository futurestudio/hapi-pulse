'use strict'

class LifecycleHandler {
  /**
   * Create a new app lifecycle handler instance
   * for the given hapi `server` based on
   * the given `options`.
   *
   * @param {Server} server - hapi server instance
   * @param {Object} options
   */
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
    this.isStopping = null
    this.preShutdown = preShutdown
    this.preServerStop = preServerStop
    this.postServerStop = postServerStop
    this.shutdownOptions = shutdownOptions
    this.signals = Array.from(
      new Set([].concat(signals))
    )
    this.shutdownListener = this.shutdown.bind(this)
  }

  /**
   * Just resolve.
   *
   * @returns {Promise}
   */
  async noop () { }

  /**
   * Add listeners for the shutdown signals.
   */
  addListeners () {
    this.signals.forEach(signal => {
      this.ensureMaxListenerCountFor(signal)
      process.on(signal, this.shutdownListener)
    })
  }

  /**
   * Ensures that registering the event listener
   * for hapi-pulse won’t exceed the max
   * listener count.
   *
   * @param {String} event
   */
  ensureMaxListenerCountFor (event) {
    const maxListeners = process.getMaxListeners()
    const listenerCount = process.listenerCount(event)

    if (listenerCount >= maxListeners) {
      process.setMaxListeners(maxListeners + 1)
    }
  }

  /**
   * Remove all shutdown listeners.
   */
  removeListeners () {
    this.signals.forEach(signal => {
      process.removeListener(signal, this.shutdownListener)
    })
  }

  /**
   * Gracefully shut down the server. Run
   * lifecycle hooks pre server-stop,
   * post server-stop and pre shutdown.
   */
  async shutdown () {
    try {
      await this.preServerStop()
      await this.onServerStop()
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

  /**
   * Stop the hapi server.
   */
  async onServerStop () {
    if (this.isStopping) {
      this.logger.info('Server is already in stopping phase.')

      return this.isStopping
    }

    this.isStopping = this.server.stop(this.shutdownOptions)

    return this.isStopping
  }
}

module.exports = LifecycleHandler
