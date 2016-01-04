var serialport = require('serialport');
var SerialPort = require('serialport').SerialPort;
var http = require('http');

var request = require('request');

var device = '/dev/ttyUSB0';
// var device = '/dev/tty.usbserial-A603I9CH';
var openWeatherAPIKey = 'dee5dc4b32fc179257d45b420482c9cb';
var openWeatherURL = 'http://api.openweathermap.org/data/2.5/weather';

var messungenUrl = 'http://home-ortiz.rhcloud.com/api/messungen';

var lastMeasurement = null;

var usbPort = new SerialPort(device, {
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
	var messung = {};
	messung.feuchtigkeit = lastMeasurement.feuchtigkeit;
	messung.temperatur = lastMeasurement.temperatur;
	messung.temperatur_gefuehlt = lastMeasurement.temperatur_gefuehlt;
	messung.zeit = new Date();

	// get local weather data
	http.get(openWeatherURL + '?APPID=' + openWeatherAPIKey + '&units=metric&id=2811204', function (response) {
	  var body = '';
    response.on('data', function(d) {
        body += d;
    });
    response.on('end', function() {
        var parsed = JSON.parse(body);
        messung.temperatur_aussen = parsed.main.temp;
        messung.feuchtigkeit_aussen = parsed.main.humidity;

        console.log(messung);
        // http post
        request.post({ url: messungenUrl, json: messung });
    });
	});
}