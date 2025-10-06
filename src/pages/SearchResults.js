import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchResults = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/routes/search/", {
          params: {
            source: query.get("source"),
            destination: query.get("destination"),
            date: query.get("date"),
          },
        });
        setRoutes(res.data);
      } catch (err) {
        console.error(err);
        setRoutes([]);
      }
    };

    if (query.get("source") && query.get("destination") && query.get("date")) {
      fetchRoutes();
    }
  }, [query]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Available Buses</h2>

      {routes.length > 0 ? (
        routes.map((route) => (
          <div key={route.id} className="border p-4 mb-2 flex justify-between">
            <div>
              <p>{route.bus.bus_name} ({route.bus.bus_number})</p>
              <p>{route.source} → {route.destination}</p>
              <p>{route.date} | {route.time}</p>
              <p>Fare: ₹{route.fare}</p>
            </div>
            <button
              onClick={() => navigate(`/booking/${route.id}`)}
              className="bg-green-600 text-white p-2"
            >
              Book
            </button>
          </div>
        ))
      ) : (
        <p>No buses found for this route.</p>
      )}
    </div>
  );
};

export default SearchResults;
