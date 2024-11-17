'use strict'

const { Parser } = require('tap-parser')

module.exports = function (options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  } else if (!options) {
    options = {}
  }

  const p = new Parser()
  const end = p.end.bind(p)
  const wait = options.wait != null ? options.wait : 1e3

  let expected = null
  let actual = 0
  let timer

  p.on('assert', onassert)
  p.on('plan', onplan)
  p.on('complete', oncomplete)
  p.once('close', onclose)

  return p

  function onclose () {
    clearTimeout(timer)

    p.removeListener('assert', onassert)
    p.removeListener('plan', onplan)
    p.removeListener('line', online)
  }

  function oncomplete (results) {
    if (callback) callback(results)
  }

  function onassert () {
    actual++
    check()
  }

  function onplan (plan) {
    expected = plan.end - plan.start
    check()
  }

  function online () {
    timer.refresh()
  }

  function check () {
    if (expected === null || actual < expected) return

    p.removeListener('assert', onassert)
    p.removeListener('plan', onplan)
    p.on('line', online)

    timer = setTimeout(end, wait)
  }
}
