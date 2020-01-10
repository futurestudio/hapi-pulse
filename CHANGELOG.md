# Changelog

## [3.0.0](https://github.com/futurestudio/hapi-pulse/compare/v2.4.0...v3.0.0) - 2020-01-10

### Breaking Changes
- require Node.js v12
  - this change aligns with the hapi ecosystem requiring Node.js v12 with the release of hapi 19


## [2.4.0](https://github.com/futurestudio/hapi-pulse/compare/v2.3.0...v2.4.0) - 2019-10-17

### Added
- basic TypeScript declarations in `lib/index.d.ts`


## [2.3.0](https://github.com/futurestudio/hapi-pulse/compare/v2.2.1...v2.3.0) - 2019-10-12

### Added
- use [Joi v16](https://github.com/hapijs/joi) to validate plugin options
- Remove duplicated event names (previously `hapi-pulse` would register shutdown listeners for each event, even for duplicates)

### Updated
- bump dependencies
- remove Node.js v11 from testing
- log info message when already in stopping phase (previously `hapi-pulse` waited for the server stop without telling the user that the stopping phase is already in progress)


## [2.2.1](https://github.com/futurestudio/hapi-pulse/compare/v2.2.0...v2.2.1) - 2019-04-24

### Updated
- updating to the scoped hapi dependencies
- bump dependencies


## [2.2.0](https://github.com/futurestudio/hapi-pulse/compare/v2.1.2...v2.2.0) - 2019-02-18

### Added
- increase max event listener count in case hapi-pulse would exceed it
- save `server.stop` promise and don’t stop the hapi server more than once

### Updated
- bump dependencies


## [2.1.2](https://github.com/futurestudio/hapi-pulse/compare/v2.1.1...v2.1.2) - 2019-01-26

### Updated
- Readme: rename GitHub references `fs-opensource -> futurestudio`


## [2.1.1](https://github.com/futurestudio/hapi-pulse/compare/v2.1.0...v2.1.1) - 2019-01-22

### Updated
- test plugin for hapi 18
- bump dependencies


## [2.1.0](https://github.com/futurestudio/hapi-pulse/compare/v2.0.0...v2.1.0) - 2019-01-16

### Added
- validating the plugin `options` using Joi

### Updated
- refactor code to a class based structure
- refactor methods and namings


## [2.0.0](https://github.com/futurestudio/hapi-pulse/compare/v1.1.1...v2.0.0) - 2018-10-19

### Added
- new extension points:
  - `preServerStop`: async function that runs before the server stop
  - `postServerStop`: async function that runs after the server stop (this was previously `onSignal`)
  - `preShutdown`: async function that runs before the process exits

### Updated
- the `onSignal` extension point is now called `postServerStop`
- remove all process listeners before exiting the process (to avoid memory leaks)
- bump dependencies
- add missing `eslint` devDependency

### Deleted
- removed useless `.prettierignore` file

### Breaking Changes
- `onSignal` becomes `postServerStop`: the method renaming makes it clear when the function gets called


## [1.1.1](https://github.com/futurestudio/hapi-pulse/compare/v1.1.0...v1.1.1) - 2018-09-11

### Added
- new option:
  - `logger`: use a custom logger for a possible error message. If something goes south, hapi-pulse calls `logger.error('message', error)`

### Updated
- split plugin and hapi server options
- extract plugin options and pass through the rest to hapi’s `await server.stop(rest)`
- update readme: add examples and `timeout` option (passed through to hapi)


## [1.1.0](https://github.com/futurestudio/hapi-pulse/compare/v1.0.0...v1.1.0) - 2018-08-20

### Added
- graceful server stop on `SIGTERM`
- new options:
  - `signals`: define the list of signals you want your server to stop
  - `onSignal`: custom function with additional shutdown handling, called after `server.stop`

### Updated
- document new options in Readme


## 1.0.0 - 2018-04-06

### Added
- `1.0.0` release 🚀 🎉
