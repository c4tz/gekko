var log = require('../core/log.js');

var RSI = require('./indicators/RSI');

function getCandle(candles) {
  newCandle = candles[0]
  candles.map( candle => {
    if (candle.high > newCandle.high)
      newCandle.high = candle.high
    if (candle.low < newCandle.low)
      newCandle.low = candle.low
  })
  newCandle.close = candles[candles.length-1].close
  return newCandle
}

// Let's create our own strategy
var strat = {};

// Prepare everything our strat needs
strat.init = function() {
  this.candles = []
  rsi5 = new RSI({'interval': 5})
  rsi15 = new RSI({'interval': 15})
  rsi60 = new RSI({'interval': 60})
  rsi240 = new RSI({'interval': 240})
}

// What happens on every new candle?
strat.update = function(candle) {
  if (this.candles.push(candle) >= 240) {
    this.candles = this.candles.slice(-240) // last 4 hours
    rsi5.update(getCandle(this.candles.slice(-5)))
    rsi15.update(getCandle(this.candles.slice(-15)))
    rsi60.update(getCandle(this.candles.slice(-60)))
    rsi240.update(getCandle(this.candles))

    oversolds = [
      rsi5.result < 20,
      rsi15.result < 25,
      rsi60.result < 25,
      rsi240.result < 25
    ]
    sum = 0
    oversolds.map( entry => {
      if (entry)
        sum += 1
    })
    if (sum > 3)
      console.log("OVERSOLD!")
  }
}

// For debugging purposes.
strat.log = function() {
  // your code!
}

// Based on the newly calculated
// information, check if we should
// update or not.
strat.check = function(candle) {
  // your code!
}

// Optional for executing code
// after completion of a backtest.
// This block will not execute in
// live use as a live gekko is
// never ending.
strat.end = function() {
  // your code!
}

module.exports = strat;
