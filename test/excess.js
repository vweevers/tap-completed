'use strict'

const test = require('tape')
const complete = require('..')
const lines = [
  'TAP version 13',
  '# excess',
  'ok 1 first thing',
  'ok 2 second thing',
  '1..2',
  '# tests 2',
  '# pass  1',
  '# fail  1',
  'ok 3 third thing'
]

test('excess', function (t) {
  t.plan(7)

  let done = false
  let closed = false

  const stream = complete({ wait: 250 }, function (results) {
    t.is(done, true)
    t.is(closed, false)
    t.is(results.pass, 2, 'pass')
    t.is(results.fail, 0, 'fail')
    t.is(results.ok, true, 'ok')
    t.is(lines.length, 0)
  })

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
  }, 25)
})
