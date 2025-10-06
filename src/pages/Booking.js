import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Booking = () => {
  const { id: routeId } = useParams();
  const navigate = useNavigate();

  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [message, setMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login"); // redirect if no token
      return;
    }

    const fetchRouteData = async () => {
      try {
        // Fetch route details
        const resRoute = await axios.get(`http://127.0.0.1:8000/api/routes/${routeId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoute(resRoute.data);

        // Fetch booked seats for this route
        const resBooking = await axios.get(`http://127.0.0.1:8000/api/bookings/`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { route: routeId },
        });

        const seats = resBooking.data.map((b) => b.seat_number);
        setBookedSeats(seats);
      } catch (err) {
        console.error(err.response || err.message);
        if (err.response?.status === 401) {
          // Invalid or expired token
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setMessage("Failed to load route or booking data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRouteData();
  }, [routeId, token, navigate]);

  const handleSeatClick = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return;
    setSelectedSeat(seatNumber);
    setMessage("");
  };

  const handleBooking = async () => {
    if (!selectedSeat) {
      setMessage("Please select a seat first!");
      return;
    }

    setBookingLoading(true);
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/bookings/",
        { route: routeId, seat_number: selectedSeat },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookedSeats((prev) => [...prev, selectedSeat]);
      setMessage(`Seat ${selectedSeat} booked successfully!`);
      setSelectedSeat(null);
    } catch (err) {
      console.error(err.response?.data || err.message);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setMessage(err.response?.data?.detail || "Booking failed!");
      }
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading)
    return <p className="text-lg text-gray-700 animate-pulse">Loading route data...</p>;
  if (!route)
    return <p className="text-lg text-red-600">Bus information not available.</p>;

  const busName = route.bus_name || "Unknown Bus";
  const busNumber = route.bus_number || "N/A";
  const totalSeats = route.available_seats || 50;
  const seatsArray = Array.from({ length: totalSeats }, (_, i) => i + 1);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-2 text-indigo-600">{busName} ({busNumber})</h2>
        <p className="mb-4 text-gray-700">
          {route.source} → {route.destination} | Date: {route.date} | Fare: ₹{route.fare}
        </p>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {seatsArray.map((seat) => {
            const isBooked = bookedSeats.includes(seat);
            const isSelected = selectedSeat === seat;
            return (
              <div
                key={seat}
                onClick={() => handleSeatClick(seat)}
                className={`w-10 h-10 flex items-center justify-center border rounded-md text-xs font-semibold transition-all duration-300 cursor-pointer
                  ${isBooked ? "bg-red-600 text-white cursor-not-allowed animate-pulse" : "bg-gray-200 hover:bg-gray-300"}
                  ${isSelected ? "bg-green-600 text-white shadow-md scale-110" : ""}`}
              >
                {seat}
              </div>
            );
          })}
        </div>

        <button
          onClick={handleBooking}
          disabled={bookingLoading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all duration-300 ${
            bookingLoading ? "cursor-not-allowed opacity-70" : ""
          }`}
        >
          {bookingLoading ? "Booking..." : "Confirm Booking"}
        </button>

        {message && (
          <p className={`mt-4 font-medium ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Booking;
