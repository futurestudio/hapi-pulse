# Changelog

## [2.1.0](https://github.com/fs-opensource/hapi-pulse/compare/v2.0.0...v2.1.0) - 2019-01-xx

### Added
- validating the plugin `options` using Joi

### Updated
- refactor code to a class based structure
- refactor methods and namings


## [2.0.0](https://github.com/fs-opensource/hapi-pulse/compare/v1.1.1...v2.0.0) - 2018-10-19

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


## [1.1.1](https://github.com/fs-opensource/hapi-pulse/compare/v1.1.0...v1.1.1) - 2018-09-11

### Added
- new option:
  - `logger`: use a custom logger for a possible error message. If something goes south, hapi-pulse calls `logger.error('message', error)`

### Updated
- split plugin and hapi server options
- extract plugin options and pass through the rest to hapi’s `await server.stop(rest)`
- update readme: add examples and `timeout` option (passed through to hapi)


## [1.1.0](https://github.com/fs-opensource/hapi-pulse/compare/v1.0.0...v1.1.0) - 2018-08-20

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
