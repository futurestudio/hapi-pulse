'use strict'

const Sinon = require('sinon')
const Lab = require('@hapi/lab')
const Hapi = require('@hapi/hapi')
const Hoek = require('@hapi/hoek')
const { expect } = require('@hapi/code')

const server = new Hapi.Server()

const { describe, it, before, beforeEach, afterEach } = (exports.lab = Lab.script())

describe('server stop on SIGINT,', () => {
  before(async () => {
    await server.register({
      plugin: require('../lib')
    })
  })

  beforeEach(async () => {
    // stub process.exit to keep the Node.js process alive while running the tests
    // else it would actually EXIT the process
    Sinon.stub(process, 'exit')
  })

  afterEach(() => {
    process.exit.restore()
  })

  it('should listen for the SIGINT event', async () => {
    const listeners = process.listeners('SIGINT')

    expect(listeners).to.exist()
    expect(listeners.length).to.equal(1)
  })

  it('stops the server on SIGINT', async () => {
    await server.start()
    // a stopped hapi server has a "started" timestamp of 0
    expect(server.info.started).to.not.equal(0)

    process.emit('SIGINT')

    // wait for the server to stop
    await Hoek.wait(100)
    Sinon.assert.called(process.exit)

    // a stopped hapi server has a "started" timestamp of 0
    expect(server.info.started).to.equal(0)
  })

  it('does not stop the server on other event', async () => {
    await server.start()
    expect(server.info.started).to.not.equal(0)

    process.emit('EVENT')

    Sinon.assert.notCalled(process.exit)
    expect(server.info.started).to.not.equal(0)
  })
})
