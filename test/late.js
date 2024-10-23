'use strict'

const test = require('tape')
const complete = require('..')
const lines = [
  'TAP version 13',
  '# late',
  'ok 1 (unnamed assert)',
  'ok 2 should be equal',
  '1..2',
  '# tests 2',
  '# pass  2',
  '# more',
  '# more',
  '# more'
]

test('late', function (t) {
  t.plan(6)

  let closed = false

  const stream = complete({ wait: 200 }, function (results) {
    t.is(closed, false)
    t.is(results.pass, 2)
    t.is(results.fail, 0)
    t.is(results.ok, true)
    t.is(lines.length, 0)
  })

  stream.on('close', function () {
    closed = true
    t.pass('closed')
  })

  const iv = setInterval(function () {
    if (lines.length === 0) {
      return clearInterval(iv)
    }

    stream.write(lines.shift() + '\n')
  }, 100)
})
