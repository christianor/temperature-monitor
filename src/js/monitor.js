const http = require('http');
const request = require('request');
const WeatherService = require('./WeatherService.js').WeatherService;
const TemperatureMonitor = require('./TemperatureMonitor.js').TemperatureMonitor;
const tempMon = new TemperatureMonitor();
const wService = new WeatherService();
const EventThrottler = require('time-based-event-throttler');

const REMOTE_API_PUSH_INTERVAL = 300000;
const REMOTE_API = 'http://home-ortiz.rhcloud.com/api/messungen';

const throttler = new EventThrottler(tempMon, "newData", pushDataToRemoteApi, 
  REMOTE_API_PUSH_INTERVAL, true);

tempMon.startPolling();

function pushDataToRemoteApi(data) {
  let messung = data;
  wService.getCurrentWeather().then(function(data) {
    messung.temperatur_aussen = data.temperature;
    messung.feuchtigkeit_aussen = data.humidity;
    messung.zeit = new Date();
    console.log('posting data ' + JSON.stringify(messung) + ' to remote api');

    request.post({ url: REMOTE_API, json: messung });
  });
}
