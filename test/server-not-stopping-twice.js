'use strict'

const Sinon = require('sinon')
const Lab = require('@hapi/lab')
const Hapi = require('@hapi/hapi')
const Hoek = require('@hapi/hoek')
const MockIo = require('mock-stdio')
const { expect } = require('@hapi/code')

const { describe, it, beforeEach, afterEach } = (exports.lab = Lab.script())

describe('server not stopping twice:', () => {
  beforeEach(async () => {
    // stub process.exit to keep the Node.js process alive while running the tests
    // else it would actually EXIT the process
    Sinon.stub(process, 'exit')
  })

  afterEach(() => {
    process.exit.restore()
  })

  it('should log a message when stopping the server more than once', async () => {
    MockIo.start()

    const server = new Hapi.Server()
    await server.register({
      plugin: require('../lib')
    })

    await server.start()

    process.emit('SIGINT')
    process.emit('SIGINT')

    // wait for the server to stop
    await Hoek.wait(100)

    const { stdout } = MockIo.end()
    expect(stdout).to.include('Server is already in stopping phase.')
  })
})
