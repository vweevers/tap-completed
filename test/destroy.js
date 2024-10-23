'use strict'

const test = require('tape')
const complete = require('..')
const template = [
  'TAP version 13',
  '# destroy',
  'ok 1 (unnamed assert)',
  'ok 2 should be equal'
]

test('destroy', function (t) {
  t.plan(2)

  const lines = template.slice()
  const stream = complete({ wait: 500 }, function (results) {
    t.is(results.ok, false, 'should not succeed')
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

test('destroy immediately', function (t) {
  t.plan(2)

  const stream = complete({ wait: 60e3 }, function (results) {
    t.is(results.ok, false, 'should not succeed')
  })

  stream.on('error', function () {
    t.fail('should not error')
  })

  stream.on('close', function () {
    t.pass('closed')
  })

  stream.destroy()
})
