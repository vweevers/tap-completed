'use strict'

module.exports = function (t, stream) {
  const events = ['finish', 'end', 'error', 'complete', 'results']
  let closed = false

  events.forEach(addListener)

  stream.on('close', function () {
    closed = true

    process.nextTick(function () {
      process.nextTick(hasListeners)
    })
  })

  function addListener (event) {
    stream.on(event, notClosed)
  }

  function hasListener (event) {
    return stream.listeners(event).includes(notClosed)
  }

  function notClosed () {
    if (closed) t.fail('event after close')
  }

  function hasListeners () {
    // Also check that removeListeners() wasn't called
    t.ok(events.every(hasListener))
  }
}
