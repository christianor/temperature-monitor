const http = require('http');
const q = require('q');

var WeatherService = function() {
	this.openWeatherApi = 'http://api.openweathermap.org/data/2.5/weather';
	this.openWeatherApiKey = 'dee5dc4b32fc179257d45b420482c9cb';
}

exports.WeatherService = WeatherService;

/** Return the current weather data as promies. 
 * @returns  {Promise} Promise that passes an object with two properties, humidity and temperature
 */
WeatherService.prototype.getCurrentWeather = function() {
	const deferred = q.defer();
	const that = this;
	http.get(this.openWeatherApi + '?APPID=' + this.openWeatherApiKey + '&units=metric&id=2811204', 
		function (response) {
			let body = '';
			response.on('data', function(d) {
				body += d;
			});

			response.on('end', function() {
				const openWeatherApiData = JSON.parse(body);
				const weatherData = that.convertOpenWeatherData(openWeatherApiData);
				deferred.resolve(weatherData)
			});
	});

	return deferred.promise;
}

/** Convert the Open Weather API data
 *  @returns {object} Has properties temperature and humidity
 */
WeatherService.prototype.convertOpenWeatherData = function(openWeatherApiData) {
	let weatherData = {};
	weatherData.temperature = openWeatherApiData.main.temp;
	weatherData.humidity = openWeatherApiData.main.humidity;

	return weatherData;
}