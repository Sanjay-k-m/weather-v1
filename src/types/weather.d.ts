export interface GetWeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;

  current_units: {
    time: string; // "iso8601"
    interval: string; // "seconds"
    temperature_2m: string; // "°C"
    rain: string; // "mm"
    is_day: string; // "" (0/1 boolean)
    relative_humidity_2m: string; // "%"
    wind_speed_10m: string; // "km/h"
    snowfall: string; // "cm" or "mm"
  };

  current: {
    time: string; // ISO string, e.g. "2025-08-30T10:30:00Z"
    interval: number;
    temperature_2m: number;
    rain: number;
    is_day: number; // 1 = day, 0 = night
    relative_humidity_2m: number;
    wind_speed_10m: number;
    snowfall: number;
  };

  hourly_units: {
    time: string; // "iso8601"
    temperature_2m: string; // "°C"
  };

  hourly: {
    time: string[];        // array of ISO strings
    temperature_2m: number[]; // array of values (converted from Float32Array)
  };
}




export interface WeatherRequest
 {
  latitude: number;
  longitude: number;
}