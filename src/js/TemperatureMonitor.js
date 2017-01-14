const serialport = require('serialport');
const EventEmitter = require('events');

var TemperatureMonitor = function() {
    this.device = '/dev/ttyUSB0';
}

exports.TemperatureMonitor = TemperatureMonitor;
TemperatureMonitor.prototype.__proto__ = EventEmitter.prototype;

/** Starts polling data from the configured serial device, emits 'newData' event as soon as new
 * temperature data came in
 */
TemperatureMonitor.prototype.startPolling = function() {
    const port = new serialport.SerialPort(this.device, {
        baudrate: 9600,
        parser: serialport.parsers.readline('\n')
    });
    const that = this;

    port.on('open', function() {
        console.log('connection established');
        usbPort.on('data', function(data) {
            try {
                that.lastData = JSON.parse(data);
                // add time to data
                data.zeit = new Date();
                that.emit('newData', data);
            } 
            catch (e) {
                // incomplete data, doesn't have to be handled
            }
        });
    });
}


