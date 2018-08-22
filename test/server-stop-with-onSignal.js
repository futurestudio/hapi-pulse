'use strict'

const Lab = require('lab')
const Code = require('code')
const Hapi = require('hapi')
const Hoek = require('hoek')
const Sinon = require('sinon')

const { describe, it, before, beforeEach, afterEach } = (exports.lab = Lab.script())

describe('server stop with onSignal:', () => {
  before(async () => {
    process.removeAllListeners('SIGINT')
  })

  beforeEach(async () => {
    // stub process.exit to keep the Node.js process alive while running the tests
    // else it would actually EXIT the process
    Sinon.stub(process, 'exit')
    Sinon.stub(console, 'error')
  })

  afterEach(() => {
    process.exit.restore()
    console.error.restore()
  })

  it('should call onSignal after stopping the server on SIGINT', async () => {
    const stub = Sinon.stub().returns(Hoek.wait(1))

    const server = new Hapi.Server()
    await server.register({
      plugin: require('../lib'),
      options: {
        onSignal: stub
      }
    })

    await server.start()
    // a stopped hapi server has a "started" timestamp of 0
    Code.expect(server.info.started).to.not.equal(0)

    process.emit('SIGINT')

    // wait for the server to stop
    await Hoek.wait(100)

    Sinon.assert.called(process.exit)
    Sinon.assert.called(stub)

    // a stopped hapi server has a "started" timestamp of 0
    Code.expect(server.info.started).to.equal(0)
  })

  it('exits the process with status 1 if an error occurs', async () => {
    const stub = Sinon.stub().throws(new Error('fake error from sinon'))

    const server = new Hapi.Server()
    await server.register({
      plugin: require('../lib'),
      options: {
        logger: console,
        onSignal: stub
      }
    })

    await server.start()

    process.emit('SIGINT')

    // wait for the server to stop
    await Hoek.wait(100)

    Sinon.assert.called(process.exit)
    Sinon.assert.called(console.error)
    Sinon.assert.called(stub)

    // a stopped hapi server has a "started" timestamp of 0
    Code.expect(server.info.started).to.equal(0)
  })
})
