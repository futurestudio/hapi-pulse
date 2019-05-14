'use strict'

const Sinon = require('sinon')
const Lab = require('@hapi/lab')
const Hapi = require('@hapi/hapi')
const Hoek = require('@hapi/hoek')
const { expect } = require('@hapi/code')

const { describe, it, beforeEach, afterEach } = (exports.lab = Lab.script())

describe('server stop with custom signals:', () => {
  beforeEach(async () => {
    // stub process.exit to keep the Node.js process alive while running the tests
    // else it would actually EXIT the process
    Sinon.stub(process, 'exit')
  })

  afterEach(() => {
    process.exit.restore()
  })

  it('increases the max listeners count for the given signals', async () => {
    process.setMaxListeners(1)

    const listener = () => {}
    process.on('HAPIPULSE', listener)

    const server = new Hapi.Server()
    await server.register({
      plugin: require('../lib'),
      options: {
        signals: ['HAPIPULSE', 'HAPIPULSE', 'PULSING']
      }
    })

    expect(process.getMaxListeners()).to.equal(2)

    await server.start()

    expect(process.listenerCount('HAPIPULSE')).to.equal(2)
    expect(process.listenerCount('PULSING')).to.equal(1)

    expect(server.info.started).to.not.equal(0)

    process.emit('HAPIPULSE')

    // wait for the server to stop
    await Hoek.wait(100)

    Sinon.assert.called(process.exit)

    // a stopped hapi server has a "started" timestamp of 0
    expect(server.info.started).to.equal(0)
  })
})
