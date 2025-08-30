import { useState, useEffect, useRef } from "react";

const SearchBox = ({ onSelectLocation }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Fetch city suggestions from Open-Meteo API
  function fetchSuggestions(searchQuery) {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }
    console.log(suggestions,'KKK')

    setIsLoading(true);
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5&language=en&format=json`)
      .then(response => {
        if (!response.ok) throw new Error("Failed to fetch suggestions");
        return response.json();
      })
      .then(data => {
        const results = (data.results || []).slice(0, 5);
        setSuggestions(results);
        setIsOpen(!isSelected && results.length > 0);
      })
      .catch(error => {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
        setIsOpen(false);
      })
      .finally(() => setIsLoading(false));
  }

  // Debounce API calls
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim() || isSelected) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(() => fetchSuggestions(query), 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, isSelected]);

  // Handle selection
  function handleSelect(location) {
    const locationName = `${location.name}, ${location.country}`;
    setQuery(locationName);
    setSuggestions([]);
    setIsOpen(false);
    setIsSelected(true);
    onSelectLocation(location.latitude, location.longitude, locationName);
    inputRef.current.blur();
  }

  // Handle input changes
  function handleInputChange(event) {
    setQuery(event.target.value);
    setIsSelected(false);
    setIsOpen(true);
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onBlur={() => {
          setTimeout(() => {
            setSuggestions([]);
            setIsOpen(false);
          }, 200);
        }}
        placeholder="Search city..."
        className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
        autoComplete="off"
      />
      {isLoading && (
        <div className="absolute right-2 top-2 text-gray-500 animate-pulse text-sm">
          Loading...
        </div>
      )}
      {suggestions.length > 0 && isOpen && (
        <ul className="absolute z-10 border border-gray-200 rounded-lg mt-1 bg-white shadow-lg w-full max-h-60 overflow-y-auto">
          {suggestions.map(s => (
            <li
              key={s.id}
              onClick={() => handleSelect(s)}
              className="cursor-pointer p-2 hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium">{s.name}</span>,{s.admin2 && ` ${s.admin2},`} {s.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;