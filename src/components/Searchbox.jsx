import React, { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import axios from "axios";

const Searchbox = ({ onSelectLocation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const map = useMap();
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // Delay of 500ms

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch results when debouncedQuery changes
  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.trim() === "") {
        setResults([]);
        return;
      }

      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            debouncedQuery
          )}&format=json&addressdetails=1&limit=5`
        );
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleLocationSelect = (lat, lon, displayName) => {
    map.setView([lat, lon], 13); // Zoom level 13
    onSelectLocation(lat, lon, displayName); // ส่ง displayName ไปยัง Parent
    setResults([]);
    setSearchQuery("");
  };
  
  return (
    <div className="flex flex-col items-center mt-4">
      <div className="flex gap-2 w-full max-w-md">
        <input
          type="text"
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input input-bordered flex-1"
        />
      </div>

      {results.length > 0 && (
        <ul className="menu bg-base-200 shadow-lg rounded-box w-full max-w-md mt-4 p-2">
          {results.map((result, index) => (
            <li
              key={index}
              onClick={() => handleLocationSelect(result.lat, result.lon, result.display_name)}
              className="p-2 hover:bg-blue hover:text-primary-content rounded cursor-pointer"
            >
              {result.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Searchbox;
