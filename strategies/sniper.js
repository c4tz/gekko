var log = require('../core/log.js');

var SMA = require('./indicators/SMA');

function addPercent(value, percent) {
    return value*((100+percent)/100)
}

function diffPercent(value1, value2) {
  return 100-((value2/value1)*100)
}

// Let's create our own strategy
var strat = {};

// Prepare everything our strat needs
strat.init = function() {
  this.requiredHistory = 1
  this.lastPrice = 0
  this.sma = new SMA(30)
  this.sma5000 = new SMA(5000)
  this.bought = false
  this.down = 0
}

// What happens on every new candle?
strat.update = function(candle) {
  this.sma.update(candle.close)
  this.sma5000.update(candle.close)
  if (!this.bought) {
    if (candle.low < addPercent(candle.open, -2)) {
      this.down -= diffPercent(candle.open, candle.low)
    }
    else if (candle.open > candle.close) {
      if (this.down < this.settings.spike) {
        if (this.sma.result > candle.close) {
          if (this.sma5000.result > candle.close) {
            this.advice('long')
            this.lastPrice = candle.close
            this.bought = true
          }
        }
      }
      this.down = 0
    }
    /*else {
      this.down = 0
    }*/
  }
  else if (this.bought) {
    if (candle.close < this.lastPrice) {
    //if (candle.close < addPercent(this.lastPrice, this.settings.limit)) {
      this.advice('short')
      this.bought = false
      this.lastPrice = 0
    }
    else if (candle.close > this.lastPrice) {
      this.lastPrice = candle.close
    }
  }
  return;
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
