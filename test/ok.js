'use strict'

const test = require('tape')
const complete = require('..')
const compat = require('./util/stream-compat')
const lines = [
  'TAP version 13',
  '# ok',
  'ok 1 (unnamed assert)',
  'ok 2 should be equal',
  '1..2',
  '# tests 2',
  '# pass  2'
]

test('ok', function (t) {
  t.plan(8)

  let done = false
  let closed = false

  const stream = complete({ wait: 0 }, function (results) {
    t.is(done, false)
    t.is(closed, false)
    t.is(results.pass, 2)
    t.is(results.fail, 0)
    t.is(results.ok, true)
    t.is(lines.length, 2)
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
      return
    }

    stream.write(lines.shift() + '\n')
  }, 250)
})
