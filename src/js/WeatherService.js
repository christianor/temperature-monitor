class WeatherService {
	function onCurrentWeather(callback) {
		http.get(OPENWEATHER_API + '?APPID=' + OPENWEATHER_API_KEY + '&units=metric&id=2811204', 
			function (response) {
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
			        callback(messung);
			    });
		});
	}
}