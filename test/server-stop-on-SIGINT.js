'use strict'

const Lab = require('lab')
const Code = require('code')
const Hoek = require('hoek')
const Sinon = require('sinon')
const Plugin = require('../lib/index').plugin

const { describe, it, beforeEach, afterEach } = (exports.lab = Lab.script())

describe('server stop on SIGINT,', () => {
  // fake the hapi server to not stub all internal hapi methods related to server.stop
  let server = {
    stop: function () {}
  }

  beforeEach(async () => {
    // stub process.exit to keep the Node.js process alive while running the tests
    // else it would actually EXIT the process
    Sinon.stub(process, 'exit')

    // stub server.stop for assertions
    Sinon.stub(server, 'stop')

    return Plugin.register(server)
  })

  afterEach(() => {
    process.exit.restore()
    server.stop.restore()
  })

  it('should listen for the SIGINT event', async () => {
    const listeners = process.listeners('SIGINT')

    Code.expect(listeners).to.exist()
    Code.expect(listeners.length).to.equal(1)
  })

  it('stops the server on SIGINT', async () => {
    process.emit('SIGINT')

    // wait for the server to stop
    await Hoek.wait(10)

    Sinon.assert.called(server.stop)
    Sinon.assert.called(process.exit)
  })

  it('does not stop the server on other event', async () => {
    process.emit('EVENT')

    Sinon.assert.notCalled(server.stop)
    Sinon.assert.notCalled(process.exit)
  })
})
