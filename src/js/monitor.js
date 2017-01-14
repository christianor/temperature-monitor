const http = require('http');
const request = require('request');
const WeatherService = require('./WeatherService.js').WeatherService;
const TemperatureMonitor = require('./TemperatureMonitor.js').TemperatureMonitor;
const Stopwatch = require('statman-stopwatch');
const tempMon = new TemperatureMonitor();
const wService = new WeatherService();
const stopwatch = new Stopwatch();
const remoteApiPushInterval = 300000;
const messung = undefined;


tempMon.on('newData', function(data) {
  // if the stopwatch hasn't started do the first push now
  if (isNaN(stopwatch.read())) {
    pushDataToRemoteApi(data);
    stopwatch.start();
  }
  else {
    if (stopwatch.read() > remoteApiPushInterval) {
      pushDataToRemoteApi(data);
      stopwatch.reset();
      stopwatch.start();
    }
  }
});

tempMon.startPolling();

function pushDataToRemoteApi(data) {
  messung = data;
  wService.getCurrentWeather().then(function(data) {
    messung.temperatur_aussen = data.temperature;
    messung.feuchtigkeit_aussen = data.humidity;
    request.post({ url: 'http://home-ortiz.rhcloud.com/api/messungen', json: messung });
  });
}
