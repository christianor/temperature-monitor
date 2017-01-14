const serialport = require('serialport');
const http = require('http');
const request = require('request');
const configuration = require('configuration.js');
const WeatherService = require('WeatherService.js');

var lastMeasurement = null;

var usbPort = new serialPort.SerialPort(configuration.SERIAL_DEVICE, {
    baudrate: 9600,
    parser: serialport.parsers.readline('\n')
  });

usbPort.on('open', function() {
  console.log('connection established');
  usbPort.on('data', function(data) {
    try {
      lastMeasurement = JSON.parse(data);
    } 
    catch (e) {
      // incomplete json data
    }
  });
});

console.log('waiting... (10 sec)');
setTimeout(pushMeasurement, 10000);

setInterval(pushMeasurement, 300000);

function pushMeasurement() {
	if (lastMeasurement == null) {
		console.log('measurement is null, skipping push');
		return;
	}

	// deep copy  the newest measurement
	let messung = {};
	messung.feuchtigkeit = lastMeasurement.feuchtigkeit;
	messung.temperatur = lastMeasurement.temperatur;
	messung.temperatur_gefuehlt = lastMeasurement.temperatur_gefuehlt;
	messung.zeit = new Date();

  let weatherService = new WeatherService.WeatherService();
  weatherService.getCurrentWeather().then(function(data) {
    messung.temperatur_aussen = data.temperature;
    messung.feuchtigkeit_aussen = data.humidity;
    console.log(messung);
    // http post
    request.post({ url: configuration.MEASUREMENT_API, json: messung });
  });
}