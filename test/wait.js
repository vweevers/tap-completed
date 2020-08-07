'use strict'

const test = require('tape')
const complete = require('..')
const compat = require('./util/stream-compat')
const lines = [
  'TAP version 13',
  '# wait',
  'ok 1 (unnamed assert)',
  'ok 2 should be equal',
  '1..2',
  '# tests 2',
  '# pass  2'
]

test('wait', function (t) {
  t.plan(7)

  let closed = false

  const stream = complete({ wait: 500 }, function (results) {
    t.is(closed, false)
    t.is(results.pass, 2)
    t.is(results.fail, 0)
    t.is(results.ok, true)
    t.is(lines.length, 0)
  })

  compat(t, stream)

  stream.on('close', function () {
    closed = true
    t.pass('closed')
  })

  const iv = setInterval(function () {
    if (lines.length === 0) {
      return clearInterval(iv)
    }

    stream.write(lines.shift() + '\n')
  }, 25)
})
