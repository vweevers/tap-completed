'use strict'

const test = require('tape')
const complete = require('..')
const compat = require('./util/stream-compat')
const template = [
  'TAP version 13',
  '# throw',
  'ok 1 (unnamed assert)',
  'Error: hmm',
  '    at Test.<anonymous> (http://localhost:51149/bundle.js:6:9)',
  '    at Test.bound [as _cb] (http://localhost:51149/bundle.js:877:32)',
  '    at Test.run (http://localhost:51149/bundle.js:893:10)',
  '    at Test.bound [as run] (http://localhost:51149/bundle.js:877:32)',
  '    at next (http://localhost:51149/bundle.js:1944:15)',
  '    at http://localhost:51149/bundle.js:37:21'
]

for (const args of [[{ wait: 1000 }], [null], []]) {
  test('throw with ' + JSON.stringify(args), function (t) {
    t.plan(8)

    let done = false
    let closed = false

    const lines = template.slice()
    const stream = complete(...args, function (results) {
      t.is(done, true)
      t.is(closed, false)
      t.is(results.pass, 1)
      t.is(results.fail, 1)
      t.is(results.ok, false)
      t.is(lines.length, 0)
    })

    compat(t, stream)

    stream.on('close', function () {
      closed = true
      t.pass('closed')
    })

    const iv = setInterval(function () {
      if (lines.length === 0) {
        clearInterval(iv)
        done = true
        return stream.end()
      }

      stream.write(lines.shift() + '\n')
    }, 25)
  })
}
