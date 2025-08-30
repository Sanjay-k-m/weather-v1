import { useMemo } from "react";
import { formatDate, formatFullDate, formatTime } from "../util/dateFormat";

interface WeatherDetailProps {
  icon: string;
  label: string;
  value: number | string;
  unit: string;
}

interface WeatherData {
  current?: {
    time?: string | Date;
    temperature_2m?: number;
    rain?: number;
    is_day?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    snowfall?: number;
  };
  current_units?: {
    snowfall?: string;
  };
  hourly?: {
    time?: (string | Date)[];
    temperature_2m?: number[];
  };
}

interface WeatherCardProps {
  weather?: WeatherData;
  locationName?: string;
}

const WeatherDetail = ({ icon, label, value, unit }: WeatherDetailProps) => (
  <div className="rounded-lg bg-white/70 backdrop-blur-sm p-3 flex flex-col items-center text-gray-900 text-center transition-transform hover:scale-105 min-w-[80px]">
    <span className="text-lg" aria-hidden="true">{icon}</span>
    <p className="text-xs opacity-70 mt-1">{label}</p>
    <p className="text-sm font-medium">{value} {unit}</p>
  </div>
);

const WeatherCard = ({ weather, locationName }: WeatherCardProps) => {
  console.log("WeatherCard: ", weather);
  // Default values for missing data
  const defaults = {
    isDay: true,
    timezone: "UTC",
    timezoneAbbreviation: "UTC",
    snowfall: 0,
    snowfallUnit: "cm",
    temperature: 0,
    rain: 0,
    humidity: 0,
    windSpeed: 0,
    time: new Date(),
  };

  // Memoized hourly forecast
  const hourlyData = useMemo(() => {
    if (!weather?.hourly?.time || !weather?.hourly?.temperature_2m) return [];
    const currentTime = new Date(weather.current?.time || defaults.time);
    return weather.hourly.time
      .map((t, i) => ({
        time: new Date(t),
        temp: weather.hourly.temperature_2m![i],
      }))
      .filter(h => h.time > currentTime)
      .slice(0, 6);
  }, [weather?.hourly?.time, weather?.hourly?.temperature_2m, weather?.current?.time]);

  // Loading state
  if (!weather) {
    return (
      <div className="p-6 rounded-2xl shadow-md bg-white/80 text-center animate-pulse">
        <p className="text-gray-500 text-base">Loading weather data...</p>
      </div>
    );
  }

  return (
    <div
      className={`w-full max-w-2xl mx-auto p-4 sm:p-6 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ease-out animate-fade-in ${(weather.current?.is_day ?? defaults.isDay)
          ? "bg-gradient-to-br from-sky-300 via-yellow-100 to-blue-200"
          : "bg-gradient-to-br from-indigo-900 via-slate-900 to-gray-800 text-white"
        }`}
      aria-label={`Weather forecast for ${locationName || "Unknown Location"}`}
    >
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold flex items-center gap-2 flex-wrap">
          <span className="text-xl sm:text-2xl" aria-hidden="true">
            {(weather.current?.is_day ?? defaults.isDay) ? "☀️" : "🌙"}
          </span>
          <span className="break-words line-clamp-2 text-ellipsis max-w-[70%]">
            {locationName || "Unknown Location"}
          </span>
        </h2>
        <div className="text-xs sm:text-sm opacity-80 flex flex-col sm:flex-row gap-2 sm:gap-4">
          <span>🗓️ {formatFullDate(weather.current?.time ?? defaults.time)}</span>
          <span>🕒 {formatTime(weather.current?.time ?? defaults.time)}</span>
        </div>
      </header>

      {/* Main temperature */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="text-4xl sm:text-5xl md:text-6xl font-bold leading-none">
          {Math.round(weather.current?.temperature_2m ?? defaults.temperature)}°
        </span>
        <span className="text-base sm:text-lg">C</span>
      </div>

      {/* Details grid */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <WeatherDetail
          icon="🌧️"
          label="Rain"
          value={Math.round(weather.current?.rain ?? defaults.rain)}
          unit="mm"
        />
        <WeatherDetail
          icon="💧"
          label="Humidity"
          value={Math.round(weather.current?.relative_humidity_2m ?? defaults.humidity)}
          unit="%"
        />
        <WeatherDetail
          icon="💨"
          label="Wind"
          value={Math.round(weather.current?.wind_speed_10m ?? defaults.windSpeed)}
          unit="km/h"
        />
        <WeatherDetail
          icon="❄️"
          label="Snowfall"
          value={Math.round(weather.current?.snowfall ?? defaults.snowfall)}
          unit={weather.current_units?.snowfall ?? defaults.snowfallUnit}
        />
      </div>

      {/* Hourly Forecast */}
      {hourlyData.length > 0 && (
        <div className="mt-4">
          <h3 className="text-base font-semibold mb-3">Hourly Forecast</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {hourlyData.map((h, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <span className="text-xs opacity-80">{formatTime(h.time)}</span>
                <span className="text-sm sm:text-base font-medium">{Math.round(h.temp)}°</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;