'use strict'

const Lab = require('lab')
const Code = require('code')
const Hapi = require('hapi')
const Hoek = require('hoek')
const Sinon = require('sinon')

const { describe, it, before, beforeEach, afterEach } = (exports.lab = Lab.script())

describe('server stop with custom signals:', () => {
  before(async () => {
    process.removeAllListeners('SIGINT')
  })

  beforeEach(async () => {
    // stub process.exit to keep the Node.js process alive while running the tests
    // else it would actually EXIT the process
    Sinon.stub(process, 'exit')
  })

  afterEach(() => {
    process.exit.restore()
  })

  it('should stop server on custom signal', async () => {
    const server = new Hapi.Server()
    await server.register({
      plugin: require('../lib'),
      options: {
        signals: ['HAPIPULSE']
      }
    })

    await server.start()
    // a stopped hapi server has a "started" timestamp of 0
    Code.expect(server.info.started).to.not.equal(0)

    process.emit('HAPIPULSE')

    // wait for the server to stop
    await Hoek.wait(100)

    Sinon.assert.called(process.exit)

    // a stopped hapi server has a "started" timestamp of 0
    Code.expect(server.info.started).to.equal(0)
  })

  it('throws if value for signals option is not an array', async () => {
    const server = new Hapi.Server()
    try {
      await server.register({
        plugin: require('../lib'),
        options: {
          signals: 'HAPIPULSE'
        }
      })
      Code.expect(true).to.not.exist()
    } catch (error) {
      Code.expect(error).to.exist()
    }
  })
})
