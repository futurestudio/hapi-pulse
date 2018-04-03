'use strict'

const Lab = require('lab')
const Code = require('code')
const Hapi = require('hapi')
const Hoek = require('hoek')
const Sinon = require('sinon')

const server = new Hapi.Server()

const { describe, it, before, after } = (exports.lab = Lab.script())

describe('server stop on SIGINT,', () => {
  before(async () => {
    await server.register({
      plugin: require('../lib/index')
    })

    // stub process.exit to keep the Node.js process alive while running the tests
    // else it would actually EXIT the process
    Sinon.stub(process, 'exit')
  })

  after(() => {
    process.exit.restore()
  })

  it('should listen for the SIGINT event', async () => {
    const listeners = process.listeners('SIGINT')

    Code.expect(listeners).to.exist()
    Code.expect(listeners.length).to.equal(1)
  })

  it('stops the server on SIGINT', async () => {
    await server.start()
    process.emit('SIGINT')

    // wait for the hapi server to stop
    await Hoek.wait(100)
    Sinon.assert.called(process.exit)

    // a stopped hapi server has a "started" timestamp of 0
    Code.expect(server.info.started).to.equal(0)
  })
})
