// src/api/weatherApi.ts
import { fetchWeatherApi } from "openmeteo";
import type { WeatherRequest,  } from "../types/weather";

/**
 * Get weather data for a given latitude and longitude
 */
export interface WeatherRequest {
  latitude: number;
  longitude: number;
}

export async function getWeather(location: WeatherRequest) {
  const params = {
    latitude: location.latitude,
    longitude: location.longitude,
    hourly: "temperature_2m",
    current: [
      "temperature_2m",
      "rain",
      "is_day",
      "relative_humidity_2m",
      "wind_speed_10m",
      "snowfall",
    ],
    // Explicitly request timezone information if supported by the API
    timezone: "auto", // Open-Meteo supports 'auto' for local timezone
  };

  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);

  // Check if responses is valid
  if (!responses || !Array.isArray(responses) || responses.length === 0) {
    throw new Error("No valid response from weather API");
  }

  // First location
  const response = responses[0];

  // Log the raw response for debugging
  console.log("API Response:", response);

  // Get UTC offset for the location
  const utcOffsetSeconds = response.utcOffsetSeconds();
  console.log("UTC Offset (seconds):", utcOffsetSeconds);

  const current = response.current();
  const hourly = response.hourly();

  // Validate current and hourly data
  if (!current || !hourly) {
    throw new Error("Missing current or hourly data in API response");
  }

  // Adjust current time for the location's timezone
  const currentTime = new Date(
    (Number(current.time()) + utcOffsetSeconds) * 1000
  );

  return {
    current: {
      time: currentTime, // Return as Date object for clarity
      temperature_2m: current.variables(0)?.value() ?? 0,
      rain: current.variables(1)?.value() ?? 0,
      is_day: current.variables(2)?.value() ?? 0,
      relative_humidity_2m: current.variables(3)?.value() ?? 0,
      wind_speed_10m: current.variables(4)?.value() ?? 0,
      snowfall: current.variables(5)?.value() ?? 0,
    },
    hourly: {
      time: [
        ...Array(
          (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval()
        ),
      ].map(
        (_, i) =>
          new Date(
            (Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) *
              1000
          )
      ),
      temperature_2m: hourly.variables(0)?.valuesArray() ?? [],
    },
  };
}


export async function searchLocation( query: string) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query
  )}&count=5&language=en&format=json`;
  const response = await fetch(url);
  const data = await response.json();

  return data.results;
}

export async function getCityFromLatLong(latitude: number, longitude: number) {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch city name");
  }

  const data = await response.json();

  // BigDataCloud returns city-like data here
  return {
    name: data.city || data.locality || data.principalSubdivision,
    country: data.countryName,
    latitude,
    longitude,
  };
}

