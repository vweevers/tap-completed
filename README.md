# tap-completed

**Detect when [TAP](https://testanything.org/) output has completed.** Normally with [`tap-parser`](https://github.com/tapjs/tap-parser) the `complete` event fires only when the stream ends. This module detects and waits for the expected number of assertions and then ends the stream. This is an updated and API-compatible version of [`tap-finished`](https://github.com/substack/tap-finished); see differences below.

[![npm status](http://img.shields.io/npm/v/tap-completed.svg)](https://www.npmjs.org/package/tap-completed)
[![node](https://img.shields.io/node/v/tap-completed.svg)](https://www.npmjs.org/package/tap-completed)
[![Travis build status](https://img.shields.io/travis/com/vweevers/tap-completed.svg?label=travis)](http://travis-ci.com/vweevers/tap-completed)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Usage

```js
const completed = require('tap-completed')

const ws = completed(function (results) {
  console.log(results)
})

tap.pipe(ws)
```

## Differences from `tap-finished`

- Upgraded `tap-parser` from v0.2.0 to v10
- Incorporates a fix by Julian Gruber ([substack/tap-finished#6](https://github.com/substack/tap-finished/pull/6))
- Behaves like [a modern stream](https://github.com/vweevers/on-stream-close) in that it has a `destroy([err])` method and always emits a `'close'` event
- The `wait` period (see below) resets on a new incoming line.

## API

### `ws = completed([options][, callback])`

Returns a writable stream that consumes TAP. The callback will be called with the `results` from `tap-parser`, equivalent to:

```js
const completed = require('tap-completed')
const ws = completed().on('complete', callback)
```

Options:

- `wait` (number, default 1000): how long to wait for more output (like diagnostics) after the end was detected.

## Install

With [npm](https://npmjs.org) do:

```
npm install tap-completed
```

## License

[MIT](LICENSE.md) © 2013-present James Halliday, 2020-present Vincent Weevers.
