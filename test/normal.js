'use strict'

const test = require('tape')
const complete = require('..')
const compat = require('./util/stream-compat')
const template = [
  'TAP version 13',
  '# normal',
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

test('normal end', function (t) {
  t.plan(7)

  let closed = false

  const lines = template.slice()
  const stream = complete({ wait: 60e3 }, function (results) {
    t.is(closed, false)
    t.is(results.pass, 1)
    t.is(results.fail, 1)
    t.is(results.ok, false)
    t.is(lines.length, 0)
  })

  stream.on('close', function () {
    closed = true
    t.pass('closed')
  })

  compat(t, stream)

  const iv = setInterval(function () {
    if (lines.length === 0) {
      clearInterval(iv)
      stream.end()
      return
    }

    stream.write(lines.shift() + '\n')
  }, 25)
})

test('normal end, immediately', function (t) {
  t.plan(6)

  let closed = false

  const stream = complete({ wait: 60e3 }, function (results) {
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

  stream.write(template.join('\n'))
  stream.end()
})

test('normal end, with complete event', function (t) {
  t.plan(7)

  let closed = false

  const lines = template.slice()
  const stream = complete({ wait: 60e3 }).on('complete', function (results) {
    t.is(closed, false)
    t.is(results.pass, 1)
    t.is(results.fail, 1)
    t.is(results.ok, false)
    t.is(lines.length, 0)
  })

  stream.on('close', function () {
    closed = true
    t.pass('closed')
  })

  compat(t, stream)

  const iv = setInterval(function () {
    if (lines.length === 0) {
      clearInterval(iv)
      stream.end()
      return
    }

    stream.write(lines.shift() + '\n')
  }, 25)
})
