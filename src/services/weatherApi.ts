import { fetchWeatherApi } from 'openmeteo';

const params = {
	"latitude": 52.52,
	"longitude": 13.41,
	"hourly": "temperature_2m",
	"current": ["temperature_2m", "rain", "is_day", "relative_humidity_2m", "wind_speed_10m", "snowfall"],
};
const url = "https://api.open-meteo.com/v1/forecast";
const responses = await fetchWeatherApi(url, params);

// Process first location. Add a for-loop for multiple locations or weather models
const response = responses[0];

// Attributes for timezone and location
const latitude = response.latitude();
const longitude = response.longitude();
const elevation = response.elevation();
const utcOffsetSeconds = response.utcOffsetSeconds();

console.log(
	`\nCoordinates: ${latitude}°N ${longitude}°E`,
	`\nElevation: ${elevation}m asl`,
	`\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`,
);

const current = response.current()!;
const hourly = response.hourly()!;

// Note: The order of weather variables in the URL query and the indices below need to match!
const weatherData = {
	current: {
		time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
		temperature_2m: current.variables(0)!.value(),
		rain: current.variables(1)!.value(),
		is_day: current.variables(2)!.value(),
		relative_humidity_2m: current.variables(3)!.value(),
		wind_speed_10m: current.variables(4)!.value(),
		snowfall: current.variables(5)!.value(),
	},
	hourly: {
		time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
			(_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
		),
		temperature_2m: hourly.variables(0)!.valuesArray(),
	},
};

// 'weatherData' now contains a simple structure with arrays with datetime and weather data
console.log(
	`\nCurrent time: ${weatherData.current.time}`,
	`\nCurrent temperature_2m: ${weatherData.current.temperature_2m}`,
	`\nCurrent rain: ${weatherData.current.rain}`,
	`\nCurrent is_day: ${weatherData.current.is_day}`,
	`\nCurrent relative_humidity_2m: ${weatherData.current.relative_humidity_2m}`,
	`\nCurrent wind_speed_10m: ${weatherData.current.wind_speed_10m}`,
	`\nCurrent snowfall: ${weatherData.current.snowfall}`,
);
console.log("\nHourly data", weatherData.hourly)