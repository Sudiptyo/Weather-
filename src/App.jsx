import React, { useState, useRef, useEffect } from "react";
import { FaSkyatlas } from "react-icons/fa6";
import { MdSunny } from "react-icons/md";
import { FaCloud } from "react-icons/fa";
import { FaRegSnowflake } from "react-icons/fa";
import { IoThunderstorm } from "react-icons/io5";
import { GiRainbowStar } from "react-icons/gi";
import { RiMistFill } from "react-icons/ri";
import { MdFoggy } from "react-icons/md";
import { FaDroplet } from "react-icons/fa6";
import { FaGlassWaterDroplet } from "react-icons/fa6";
import { FaWind } from "react-icons/fa";
import { FaSun } from "react-icons/fa";
import { IoSunny } from "react-icons/io5";
import { FaCloudRain, FaSearch } from "react-icons/fa";
import cities from "../cities.json";
import axios from "axios";

const App = () => {
  const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
  const [suggestions, setSuggestions] = useState([]);
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState({});
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  // REF for suggestions box
  const suggestionsRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion(
        (prev) => (prev - 1 + suggestions.length) % suggestions.length
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = suggestions[activeSuggestion];
      handleSuggestionClick(selected);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setCity(value);
    if (value.length > 0) {
      const matches = cities
        .filter((c) => c.toLowerCase().startsWith(value.toLowerCase()))
        .slice(0, 5);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const getWeatherData = async (cityName = city) => {
    const selectedCity = cities.find(
      (c) => c.toLowerCase() === cityName.toLowerCase()
    );
    if (!selectedCity) {
      alert("City not found!");
      setCity("");
      return;
    }
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}`
      );
      setWeather(response.data);
      setCity("");
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion);
    setSuggestions([]);
    getWeatherData(suggestion);
  };

  const getWeatherIcon = (main) => {
    switch (main) {
      case "Clear":
        return <FaSkyatlas size={80} />;
      case "Clouds":
        return <FaCloud size={80} />;
      case "Rain":
        return <FaCloudRain size={80} />;
      case "Snow":
        return <FaRegSnowflake size={80} />;
      case "Thunderstorm":
        return <IoThunderstorm size={80} />;
      case "Mist":
        return <RiMistFill size={80} />;
      case "Fog":
        return <MdFoggy size={80} />;
      default:
        return <GiRainbowStar size={80} />;
    }
  };

  return (
    <div className="relative flex justify-center items-center px-4 min-h-screen bg-weather-gradient">
      <div className="max-w-5xl w-full shadow-2xl p-8 bg-weather-gradient backdrop-blur-sm rounded-2xl space-y-6 border-white/20">
        {/* header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">
          <h1 className="font-bold text-4xl text-white tracking-wide">
            WeatherNow
          </h1>
          <div className="w-full md:w-auto relative">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="Enter City..."
                value={city}
                onChange={handleSearch}
                onKeyDown={handleKeyDown}
                className="px-4 py-4 w-full bg-white/20 placeholder-white text-white border-2 border-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <button
                className="p-3 bg-white/20 text-white rounded-2xl cursor-pointer"
                onClick={() => getWeatherData()}
              >
                <FaSearch size={28} className="text-white" />
              </button>
            </div>
            {suggestions.length > 0 && (
              <ul
                ref={suggestionsRef} // <-- attach ref here
                className="absolute z-50 w-full bg-white text-black rounded-xl p-4 mt-2 space-y-2 overflow-hidden shadow-md max-h-48 overflow-y-auto "
              >
                {suggestions.map((s, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(s)}
                    className={`px-4 py-2 cursor-pointer hover:bg-purple-100 ${
                      index === activeSuggestion ? "bg-purple-200" : ""
                    }`}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* weather info */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-weather-gradient backdrop-blur-sm rounded-xl p-6 shadow-xl space-y-4 md:space-y-0">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-start justify-center md:justify-start space-x-2">
              <h2 className="text-7xl md:text-8xl text-white font-bold">
                {Math.round(weather.main?.temp - 273.15) || 0}
              </h2>
              <span className="text-3xl md:text-5xl text-white">°C</span>
            </div>
            <h3 className="text-white text-xl md:text-2xl font-medium">
              {weather.name
                ? `${weather.name}, ${weather.sys?.country}`
                : "City Name"}
            </h3>
            <h4 className="text-white text-lg md:text-xl capitalize">
              {weather.weather?.[0]?.main || "Clear"}
            </h4>
          </div>
          <div className="text-white">
            {getWeatherIcon(weather.weather?.[0]?.main)}
          </div>
        </div>

        {/* info boxes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
          <WeatherBox
            icon={<FaDroplet size={32} />}
            title="Humidity"
            value={`${weather.main?.humidity}%`}
          />
          <WeatherBox
            icon={<FaGlassWaterDroplet size={32} />}
            title="Pressure"
            value={`${weather.main?.pressure} hPa`}
          />
          <WeatherBox
            icon={<FaWind size={32} />}
            title="Wind"
            value={`${weather.wind?.speed} m/s`}
          />
          <WeatherBox
            icon={<IoSunny size={32} />}
            title="Feels Like"
            value={`${Math.round(weather.main?.feels_like - 273.15)}°C`}
          />
        </div>
      </div>
    </div>
  );
};

const WeatherBox = ({ icon, title, value }) => {
  return (
    <div className="backdrop-blur-sm rounded-2xl p-4 shadow-xl flex flex-col items-center space-y-2 border-white/20 hover:scale-105 transition-transform">
      <div className="text-white">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
};

export default App;
