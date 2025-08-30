import { useEffect, useState } from "react";
import SearchBox from "./components/SearchBox";
import WeatherCard from "./components/WeatherCard";
import { getCityFromLatLong, getWeather } from "./services/weatherApi";
import { getUserLocation } from "./util/getUserLocation";
import { SourceInfo } from "./components/SourceInfo";

const App = () => {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [source, setSource] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user location on mount
  useEffect(() => {
    let isMounted = true;

    getUserLocation()
      .then(loc => {
        if (isMounted) {
          setLocation({ latitude: loc.latitude, longitude: loc.longitude });
          setSource(loc.source);
        }
      })
      .catch(() => {
        if (isMounted) setError("Unable to fetch your location. Please search for a city.");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch weather data when location changes
  useEffect(() => {
    if (!location) return;

    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      getWeather(location),
      getCityFromLatLong(location.latitude, location.longitude),
    ])
      .then(([weatherResponse, city]) => {
        if (isMounted) {
          setData(weatherResponse);
          setLocationName(`${city.name}, ${city.country}`);
          setError(null);
        }
      })
      .catch(() => {
        if (isMounted) setError("Failed to fetch weather data. Please try again.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [location]);

  // Handle location selection from SearchBox
  const handleSelectLocation = (lat, lon, name) => {
    setLocation({ latitude: lat, longitude: lon });
    setSource("search");
    setLocationName(name);
    setError(null);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-100 to-purple-200 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12"
      role="main"
      aria-label="Weather Application"
    >
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 transition-all duration-500 ease-out animate-fade-in">
        <header className="mb-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">
            Weather Forecast
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-500">
            Get real-time weather updates for any location
          </p>
        </header>
        <div className="flex flex-col gap-6">
          {/* Search Box */}
          <SearchBox onSelectLocation={handleSelectLocation} />

          {/* Loading Indicator */}
          {isLoading && (
            <div className="text-center text-gray-600 animate-pulse text-sm sm:text-base font-medium bg-gray-100/50 p-4 rounded-xl">
              <svg
                className="animate-spin h-5 w-5 mx-auto text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              <span className="mt-2 block">Loading weather data...</span>
            </div>
          )}

          {/* Error Message */}
          {error && !isLoading && (
            <div
              className="text-red-600 text-center text-sm sm:text-base font-medium bg-red-50/80 p-4 rounded-xl border border-red-200"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Weather Card */}
          <WeatherCard weather={data} locationName={locationName} />

          {/* Source Information */}
          <SourceInfo source={source} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default App;