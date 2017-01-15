const http = require('http');
const request = require('request');
const WeatherService = require('./WeatherService.js').WeatherService;
const TemperatureMonitor = require('./TemperatureMonitor.js').TemperatureMonitor;
const Stopwatch = require('statman-stopwatch');
const tempMon = new TemperatureMonitor();
const wService = new WeatherService();
const stopwatch = new Stopwatch();

const REMOTE_API_PUSH_INTERVAL = 300000;
const REMOTE_API = 'http://home-ortiz.rhcloud.com/api/messungen';
var messung = undefined;

tempMon.on('newData', function(data) {
  // if the stopwatch hasn't started do the first push now
  if (isNaN(stopwatch.read())) {
    console.log('executing first push to remote api (' + REMOTE_API + ')');
    console.log('sensor data is: ' + JSON.stringify(data));
    pushDataToRemoteApi(data);
    stopwatch.start();
  }
  else {
    if (stopwatch.read() > REMOTE_API_PUSH_INTERVAL) {
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
    messung.zeit = new Date();
    console.log('posting data ' + JSON.stringify(messung) + ' to remote api');

    request.post({ url: REMOTE_API, json: messung });
  });
}
