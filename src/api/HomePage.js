import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sources, setSources] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [filter, setFilter] = useState({ source: "", destination: "", date: "" });
  const navigate = useNavigate();

  // Fetch all routes initially
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/buses/");
        setRoutes(res.data);

        // Extract unique sources and destinations for filter dropdowns
        const uniqueSources = [...new Set(res.data.map((r) => r.source))];
        const uniqueDestinations = [...new Set(res.data.map((r) => r.destination))];
        setSources(uniqueSources);
        setDestinations(uniqueDestinations);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const filteredRoutes = routes.filter((r) => {
    return (
      (!filter.source || r.source === filter.source) &&
      (!filter.destination || r.destination === filter.destination) &&
      (!filter.date || r.date === filter.date)
    );
  });

  if (loading) return <p className="text-lg font-medium text-gray-500 animate-pulse">Loading buses...</p>;
  if (!routes.length) return <p className="text-lg font-medium text-red-500">No buses available.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6 animate-bounce">Bus Routes</h1>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center items-center">
        <select
          name="source"
          value={filter.source}
          onChange={handleFilterChange}
          className="p-2 rounded-lg border shadow-md"
        >
          <option value="">Select Source</option>
          {sources.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          name="destination"
          value={filter.destination}
          onChange={handleFilterChange}
          className="p-2 rounded-lg border shadow-md"
        >
          <option value="">Select Destination</option>
          {destinations.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <input
          type="date"
          name="date"
          value={filter.date}
          onChange={handleFilterChange}
          className="p-2 rounded-lg border shadow-md"
        />
      </div>

      {/* Buses List */}
      <div className="grid gap-6 max-w-6xl mx-auto">
        {filteredRoutes.length > 0 ? (
          filteredRoutes.map((route) => {
            const totalSeats = route.bus.total_seats || 50;
            const bookedSeats = route.booked_seats || [];
            const availableSeats = totalSeats - bookedSeats.length;

            const seatsArray = Array.from({ length: totalSeats }, (_, i) => i + 1);

            return (
              <div
                key={route.id}
                className="relative bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-start transition-transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex flex-col mb-4 md:mb-0">
                  <h2 className="text-2xl font-bold text-indigo-600">{route.bus.bus_name} ({route.bus.bus_number})</h2>
                  <p className="text-gray-700">{route.source} → {route.destination}</p>
                  <p className="text-gray-600">Date: {route.date} | Departure: {route.time} | Duration: {route.travel_duration || "N/A"}</p>
                  <p className="text-gray-800 font-semibold mt-1">Fare: ₹{route.fare}</p>
                  <p className="text-green-600 font-semibold mt-1">Available Seats: {availableSeats}</p>

                  {/* Mini seat map */}
                  <div className="grid grid-cols-10 gap-1 mt-3">
                    {seatsArray.map((seat) => (
                      <div
                        key={seat}
                        className={`w-4 h-4 rounded-sm border text-xs flex items-center justify-center
                          ${bookedSeats.includes(seat) ? "bg-red-600" : "bg-green-400"}
                        `}
                        title={`Seat ${seat} ${bookedSeats.includes(seat) ? "(Booked)" : "(Available)"}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center md:items-end mt-3 md:mt-0">
                  <button
                    onClick={() => navigate(`/booking/${route.id}`)}
                    disabled={availableSeats === 0}
                    className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all duration-300 ${
                      availableSeats === 0 ? "cursor-not-allowed opacity-70" : ""
                    }`}
                  >
                    {availableSeats > 0 ? "Book Now" : "Full"}
                  </button>
                </div>

                {/* Animated bus icon */}
                <div className="absolute top-2 right-2 w-8 h-8 bg-yellow-400 rounded-full animate-bounce shadow-lg"></div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-red-600 font-semibold">No buses match your criteria.</p>
        )}
      </div>

      {/* Tailwind animations */}
      <style>
        {`
          @keyframes bounce { 
            0%,100%,50%{transform:translateY(0);} 
            25%{transform:translateY(-5px);} 
            75%{transform:translateY(-3px);} 
          }
          .animate-bounce { animation: bounce 2s ease-in-out infinite; }
        `}
      </style>
    </div>
  );
};

export default HomePage;
