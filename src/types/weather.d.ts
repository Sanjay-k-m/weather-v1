// Weather API Response Type
export interface WeatherResponse {
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
    is_day: string; // "" (empty string, meaning boolean 0/1 in `current`)
    relative_humidity_2m: string; // "%"
    wind_speed_10m: string; // "km/h"
  };

  current: {
    time: string; // e.g. "2025-08-30T10:30"
    interval: number; // seconds
    temperature_2m: number;
    rain: number;
    is_day: number; // 1 = day, 0 = night
    relative_humidity_2m: number;
    wind_speed_10m: number;
  };

  hourly_units: {
    time: string; // "iso8601"
    temperature_2m: string; // "°C"
  };

  hourly: {
    time: string[];
    temperature_2m: number[];
  };
}
