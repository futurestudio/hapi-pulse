<div align="center">
  <img width="471" style="max-width:100%;" src="https://raw.githubusercontent.com/futurestudio/hapi-pulse/master/media/hapi-pulse.png" alt="hapi-pulse logo">

  <br/>
  <br/>

  <p>
    hapi plugin to gracefully stop your hapi server
  </p>
  <br/>
  <p>
    <a href="#installation"><strong>Installation</strong></a> ·
    <a href="#usage"><strong>Usage</strong></a> ·
    <a href="#plugin-registration-options"><strong>Plugin Options</strong></a>
  </p>
  <br/>
  <br/>
  <p>
     <a href="https://travis-ci.org/futurestudio/hapi-pulse"><img src="https://travis-ci.org/futurestudio/hapi-pulse.svg?branch=master" alt="Build Status" data-canonical-src="https://travis-ci.org/futurestudio/hapi-pulse.svg?branch=master" style="max-width:100%;"></a>
    <a href="https://snyk.io/test/github/futurestudio/hapi-pulse"><img src="https://snyk.io/test/github/futurestudio/hapi-pulse/badge.svg" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/github/futurestudio/hapi-pulse" style="max-width:100%;"></a>
    <a href="https://www.npmjs.com/package/hapi-pulse"><img src="https://img.shields.io/npm/v/hapi-pulse.svg" alt="Latest Version"></a>
    <a href="https://www.npmjs.com/package/hapi-pulse"><img src="https://img.shields.io/npm/dm/hapi-pulse.svg" alt="Total downloads"></a>
    <a href="https://greenkeeper.io/" rel="nofollow"><img src="https://badges.greenkeeper.io/futurestudio/hapi-pulse.svg" alt="Greenkeeper badge" data-canonical-src="https://badges.greenkeeper.io/futurestudio/hapi-pulse.svg" style="max-width:100%;"></a>
  </p>
  <p>
    <em>Follow <a href="http://twitter.com/marcuspoehls">@marcuspoehls</a> for updates!</em>
  </p>
</div>

------

<p align="center"><sup>The <a href="https://futurestud.io">Future Studio University</a> supports development of this hapi plugin 🚀</sup>
<br><b>
Join the <a href="https://futurestud.io/university">Future Studio University and Skyrocket in Node.js</a></b>
</p>

------


## Introduction
A hapi plugin that gracefully stops the hapi server on `SIGINT` and `SIGTERM` and your custom signals.

`hapi-pulse` works great with **PM2** and other Node.js process manager to accomplish zero-downtime deployments!

This serves existing requests before closing the connection and stopping the hapi server process.
It uses hapi’s `server.stop()` method to close connections properly.


## Requirements
> **hapi v19 (or later)** and **Node.js v12 (or newer)**

This plugin requires **hapi v19** (or later) and **Node.js v12 or newer**.


### Compatibility
| Major Release | [hapi.js](https://github.com/hapijs/hapi) version | Node.js version |
| --- | --- | --- |
| `v3` | `>=17 hapi` | `>=12` |
| `v2` | `>=17 hapi` | `>=8` |


## Installation
Add `hapi-pulse` as a dependency to your project:

```bash
npm i hapi-pulse
```


## Usage
The most straight forward way to register the `hapi-pulse` plugin:

```js
await server.register({
  plugin: require('hapi-pulse'),
  options: {
    // any option that is supported by hapi's "server.stop()"
    timeout: 15000,

    // plugin specific options
    logger: console,
    signals: ['SIGINT'],
    postServerStop: async function () {
      // await Database.close()
    }
  }
})
```


## Plugin Registration Options
`hapi-pulse` passes the options through to hapi’s [`server.stop(options)`](https://hapijs.com/api#-await-serverstopoptions).
Customize the behavior of `server.stop()`, like the `timeout` before forcefully stopping the process.

Additionally, you can pass along the following options:

- **logger**: `(Object)`, default: `console` — in case of an error, hapi-pulse logs the error with `logger.error('message', error)`
- **signals**: `(Array)`, default: `['SIGINT', 'SIGTERM']` — use this `signals` option to customize the events on which hapi-pulse will stop the server
- **preServerStop**: `(Function)`, default: `Promise.resolve` — an async function that runs before `server.stop()`
- **postServerStop**: `(Function)`, default: `Promise.resolve` — an async function that runs after `server.stop()`
- **preShutdown**: `(Function)`, default: `Promise.resolve` — an async function that runs after `postServerStop()` and before `process.exit`
- **timeout**: `(int)`, default: `5000 (5 seconds)` — the timeout existing connections should be closed until they are forcefully interrupted. This option is passed through to hapi’s `server.stop()`

**Example**

```js
await server.register({
  plugin: require('hapi-pulse'),
  options: {
    timeout: 25 * 1000,
    logger: console,
    signals: ['SIGINT', 'SIGTERM'],
    preServerStop: async function () {
      // this runs before server.stop()
    },
    postServerStop: async function () {
      // this runs after server.stop()
      // e.g., await Database.close()
    },
    preShutdown: async function () {
      // this runs after postServerStop() and before process.exit
    }
  }
})

// went smooth like chocolate :)
```


## Feature Requests
Do you miss a feature? Please don’t hesitate to
[create an issue](https://github.com/futurestudio/hapi-pulse/issues) with a short description of your desired addition to this plugin.


## Links & Resources

- [hapi tutorial series](https://futurestud.io/tutorials/hapi-get-your-server-up-and-running) with 100+ tutorials


## Contributing

1.  Create a fork
2.  Create your feature branch: `git checkout -b my-feature`
3.  Commit your changes: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request 🚀


## License

MIT © [Future Studio](https://futurestud.io)

---

> [futurestud.io](https://futurestud.io) &nbsp;&middot;&nbsp;
> GitHub [@futurestudio](https://github.com/futurestudio/) &nbsp;&middot;&nbsp;
> Twitter [@futurestud_io](https://twitter.com/futurestud_io)
