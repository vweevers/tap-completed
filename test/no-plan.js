'use strict'

const test = require('tape')
const complete = require('..')
const lines = [
  'TAP version 13',
  '# no plan',
  'ok 1 (unnamed assert)',
  'not ok 2 should be equal',
  '  ---',
  '    operator: equal',
  '    expected: 5',
  '    actual:   4',
  '  ...',
  '',
  '# tests 2',
  '# pass  1',
  '# fail  1'
]

test('no plan', function (t) {
  t.plan(1)

  const stream = complete({ wait: 0 }, function (results) {
    t.fail('should not complete')
  })

  const iv = setInterval(function () {
    if (lines.length === 0) {
      clearInterval(iv)
      return setTimeout(function () { t.pass() }, 50)
    }

    stream.write(lines.shift() + '\n')
  }, 25)
})
