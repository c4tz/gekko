var log = require('../core/log.js');

var SMA = require('./indicators/SMA');

function addPercent(value, percent) {
    return value*((100+percent)/100)
}

// Let's create our own strategy
var strat = {};

// Prepare everything our strat needs
strat.init = function() {
  this.requiredHistory = 1;
  this.lastPrice = 0;
  this.sma = new SMA(30);
  this.bought = false;
}

// What happens on every new candle?
strat.update = function(candle) {
  this.sma.update(candle.close);
  if (!this.bought) {
    if (candle.low < addPercent(candle.open, this.settings.spike)) {
      if (this.sma.result > candle.close) {
          this.advice('long')
          this.lastPrice = candle.close
          this.bought = true
      }
    }
  }
  else if (this.bought) {
    if (candle.close < addPercent(this.lastPrice, this.settings.limit)) {
      this.advice('short')
      this.bought = false
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
