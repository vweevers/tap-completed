'use strict'

const test = require('tape')
const complete = require('..')
const template = [
  'TAP version 13',
  '# destroy timer',
  'ok 1 (unnamed assert)',
  'ok 2 should be equal',
  '1..2',
  '# tests 2',
  '# pass  2'
]

test('destroy() clears timer', function (t) {
  t.plan(5)

  const lines = template.slice()
  const stream = complete({ wait: 5e6 }, function (results) {
    // Since tap-completed 2, destroy() does the same as end() if completed
    t.is(results.pass, 2, 'pass')
    t.is(results.fail, 0, 'fail')
    t.is(results.ok, true, 'ok')
    t.is(lines.length, 0)
  })

  stream.on('error', function () {
    t.fail('should not error')
  })

  stream.on('close', function () {
    t.pass('closed')
  })

  const iv = setInterval(function () {
    if (lines.length === 0) {
      stream.destroy()
      return clearInterval(iv)
    }

    stream.write(lines.shift() + '\n')
  }, 25)
})

test('end() clears timer', function (t) {
  t.plan(5)

  const lines = template.slice()
  const stream = complete({ wait: 5e6 }, function (results) {
    t.is(results.pass, 2, 'pass')
    t.is(results.fail, 0, 'fail')
    t.is(results.ok, true, 'ok')
    t.is(lines.length, 0)
  })

  stream.on('error', function () {
    t.fail('should not error')
  })

  stream.on('close', function () {
    t.pass('closed')
  })

  const iv = setInterval(function () {
    if (lines.length === 0) {
      stream.end()
      return clearInterval(iv)
    }

    stream.write(lines.shift() + '\n')
  }, 25)
})
