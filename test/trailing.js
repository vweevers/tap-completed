'use strict'

const test = require('tape')
const complete = require('..')
const compat = require('./util/stream-compat')
const lines = [
  'TAP version 13',
  '# trailing',
  'ok 1 (unnamed assert)',
  'not ok 2 should be equal',
  '  ---',
  '    operator: equal',
  '    expected: 5',
  '    actual:   4',
  '  ...',
  '',
  '1..2',
  '# tests 2',
  '# pass  1',
  '# fail  1'
]

test('trailing', function (t) {
  t.plan(6)

  let closed = false

  const stream = complete({ wait: 0 }, function (results) {
    t.is(closed, false)
    t.is(results.pass, 1)
    t.is(results.fail, 1)
    t.is(results.ok, false)
  })

  compat(t, stream)

  stream.on('close', function () {
    closed = true
    t.pass('closed')
  })

  stream.write(lines.join('\n'))
})
