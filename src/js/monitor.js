const serialport = require('serialport');
const http = require('http');
const request = require('request');
const configuration = require('configuration.js');



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
	var messung = {};
	messung.feuchtigkeit = lastMeasurement.feuchtigkeit;
	messung.temperatur = lastMeasurement.temperatur;
	messung.temperatur_gefuehlt = lastMeasurement.temperatur_gefuehlt;
	messung.zeit = new Date();

	// get local weather data
	http.get(configuration.OPENWEATHER_API + '?APPID=' 
    + configuartion.OPENWEATHER_API_KEY + '&units=metric&id=2811204', function (response) {
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
        request.post({ url: configuration.MEASUREMENT_API, json: messung });
    });
	});
}