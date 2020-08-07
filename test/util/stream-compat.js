'use strict'

module.exports = function (t, stream) {
  const events = ['finish', 'end', 'error', 'complete', 'results']

  stream.on('close', function () {
    events.forEach(addListener)

    process.nextTick(function () {
      process.nextTick(assert)
    })
  })

  function addListener (event) {
    stream.on(event, fail)
  }

  function hasListener (event) {
    return stream.listeners(event).includes(fail)
  }

  function fail () {
    t.fail('event after close')
  }

  function assert () {
    // Also check that removeListeners() wasn't called
    t.ok(events.every(hasListener), 'closed')
  }
}
