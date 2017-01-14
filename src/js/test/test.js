const assert = require('assert');
const WeatherService = require('../WeatherService.js').WeatherService;
const TemperatureMonitor = require('../TemperatureMonitor.js').TemperatureMonitor;
const Stopwatch = require('statman-stopwatch');


/** WeatherService tests */
describe('WeatherService', function() {
  let ws = new WeatherService();
  describe('#getCurrentWeather()', function() {
    it('should return a promise', function() {
      weatherDataPromise = ws.getCurrentWeather();
      assert.notEqual(weatherDataPromise.then, undefined);
    });
    it('the promise should return data', function() {
      weatherDataPromise = ws.getCurrentWeather();
      return weatherDataPromise.then(function(data) {
        assert.notEqual(data, undefined);
        assert.notEqual(data.temperature, undefined);
        assert.notEqual(data.humidity, undefined);
      });
    });
  });
});

/** Stopwatch tests */
describe('StopWatch', function() {
  let tm = new TemperatureMonitor();
  describe('#read()', function() {
    it('it should be NaN if not started', function() {
      var sw = new Stopwatch();
      assert.equal(isNaN(sw.read()), true);
    });
  });
});