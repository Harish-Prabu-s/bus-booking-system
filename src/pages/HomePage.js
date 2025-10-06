import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

 const fetchBuses = async (params = {}) => {
  try {
    setSearching(true);
    const res = await axios.get("http://127.0.0.1:8000/api/routes/", { params });

    console.log("API Data:", res.data);  // 👈 Check what comes here

    let filteredBuses = res.data;

    if (params.source) {
      filteredBuses = filteredBuses.filter((bus) =>
        bus.source.toLowerCase().includes(params.source.toLowerCase())
      );
    }
    if (params.destination) {
      filteredBuses = filteredBuses.filter((bus) =>
        bus.destination.toLowerCase().includes(params.destination.toLowerCase())
      );
    }
    if (params.date) {
      filteredBuses = filteredBuses.filter((bus) => bus.date === params.date);
    }

    setBuses(filteredBuses);
  } catch (err) {
    console.error("Error fetching buses:", err);
  } finally {
    setLoading(false);
    setSearching(false);
  }
};


  useEffect(() => {
    fetchBuses();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBuses({
      source: source || undefined,
      destination: destination || undefined,
      date: date || undefined,
    });
  };

  // 🔥 Group buses by route (source → destination)
  const groupedRoutes = buses.reduce((acc, bus) => {
    const key = `${bus.source} → ${bus.destination}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(bus);
    return acc;
  }, {});

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-x-hidden">
      {/* Floating Bus Animation */}
      <div className="absolute w-full h-full top-0 left-0 overflow-hidden z-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-16 h-16 bg-yellow-400 rounded-full shadow-lg animate-bus"
            style={{
              top: `${10 + i * 15}%`,
              left: `${-20 - i * 30}%`,
              animationDuration: `${10 + i * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Search Section */}
      <div className="relative z-10 max-w-5xl mx-auto p-6 mt-12 bg-white rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold mb-6 text-center text-indigo-600 animate-fade-in">
          Find Your Bus
        </h1>
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row items-center gap-4"
        >
          <input
            type="text"
            placeholder="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1 shadow-sm"
          />
          <input
            type="text"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1 shadow-sm"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div className="relative z-10 max-w-6xl mx-auto mt-8">
        {loading && <p className="text-center text-xl animate-pulse">Loading buses...</p>}
        {searching && <p className="text-center text-lg animate-pulse">Searching...</p>}
        {!loading && !searching && buses.length === 0 && (
          <p className="text-center text-lg text-red-600">No buses available.</p>
        )}

        {/* Grouped buses */}
        {Object.keys(groupedRoutes).map((routeKey) => (
          <div key={routeKey} className="mb-10">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">{routeKey}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedRoutes[routeKey].map((bus) => (
                <div
                  key={bus.id}
                  className="bg-white p-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:scale-105"
                >
                  <h3 className="font-bold text-lg mb-2 text-indigo-600">{bus.bus_name}</h3>
                  <p className="text-gray-700 mb-1">Date: {bus.date}</p>
                  <p className="text-gray-700 mb-1">
                    Departure: {new Date(bus.departure_time).toLocaleString()}
                  </p>
                  <p className="text-gray-700 mb-1">
                    Arrival: {new Date(bus.arrival_time).toLocaleString()}
                  </p>
                  <p className="text-gray-700 mb-1">Fare: ₹{bus.fare}</p>
                  <p className="text-gray-700 mb-1 font-semibold">
                    Seats Available: {bus.available_seats}
                  </p>
                  <button
                    onClick={() => navigate(`/booking/${bus.id}`)}
                    className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl shadow-md transition-all"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes backgroundMove {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(110%); }
          }
          .animate-bus {
            animation: backgroundMove linear infinite;
          }

          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(-20px);}
            100% { opacity: 1; transform: translateY(0);}
          }
          .animate-fade-in { animation: fadeIn 1s ease forwards;}
        `}
      </style>
    </div>
  );
};

export default HomePage;
