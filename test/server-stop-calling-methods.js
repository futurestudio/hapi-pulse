'use strict'

const Sinon = require('sinon')
const Lab = require('@hapi/lab')
const Hapi = require('@hapi/hapi')
const Hoek = require('@hapi/hoek')
const MockIo = require('mock-stdio')
const { expect } = require('@hapi/code')

const { describe, it, beforeEach, afterEach } = (exports.lab = Lab.script())

describe('server stop with onSignal:', () => {
  beforeEach(async () => {
    // stub process.exit to keep the Node.js process alive while running the tests
    // else it would actually EXIT the process
    Sinon.stub(process, 'exit')
  })

  afterEach(() => {
    process.exit.restore()
  })

  it('should call postServerStop after stopping the server on SIGINT', async () => {
    const stub = Sinon.stub().returns(Hoek.wait(1))
    const stub2 = Sinon.stub().returns(Hoek.wait(1))
    const stub3 = Sinon.stub().returns(Hoek.wait(1))

    const server = new Hapi.Server()
    await server.register({
      plugin: require('../lib'),
      options: {
        preServerStop: stub,
        postServerStop: stub2,
        preShutdown: stub3
      }
    })

    await server.start()
    // a stopped hapi server has a "started" timestamp of 0
    expect(server.info.started).to.not.equal(0)

    process.emit('SIGINT')

    // wait for the server to stop
    await Hoek.wait(100)

    Sinon.assert.called(process.exit)
    Sinon.assert.called(stub)
    Sinon.assert.called(stub2)
    Sinon.assert.called(stub3)

    // a stopped hapi server has a "started" timestamp of 0
    expect(server.info.started).to.equal(0)
  })

  it('exits the process with status 1 on error with default logger', async () => {
    const stub = Sinon.stub().throws(new Error('fake error from sinon'))

    const server = new Hapi.Server()
    await server.register({
      plugin: require('../lib'),
      options: {
        logger: { error: () => {} },
        signals: 'ERRORPULSE',
        postServerStop: stub
      }
    })

    await server.start()

    process.emit('ERRORPULSE')

    // wait for the server to stop
    await Hoek.wait(100)
    expect(process.listenerCount('ERRORPULSE')).to.equal(0)

    Sinon.assert.called(process.exit)
    Sinon.assert.called(stub)

    // a stopped hapi server has a "started" timestamp of 0
    expect(server.info.started).to.equal(0)
  })

  it('exits the process with status 1 on error with default console.error logger', async () => {
    MockIo.start()
    const stub = Sinon.stub().throws(new Error('fake error from sinon'))

    const server = new Hapi.Server()
    await server.register({
      plugin: require('../lib'),
      options: {
        signals: 'ERRORPULSE',
        postServerStop: stub
      }
    })

    await server.start()

    process.emit('ERRORPULSE')

    // wait for the server to stop
    await Hoek.wait(100)
    expect(process.listenerCount('ERRORPULSE')).to.equal(0)

    Sinon.assert.called(process.exit)
    Sinon.assert.called(stub)

    const { stderr } = MockIo.end()
    expect(stderr).to.include('fake error from sinon')

    // a stopped hapi server has a "started" timestamp of 0
    expect(server.info.started).to.equal(0)
  })
})
