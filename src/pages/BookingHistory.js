import React, { useEffect, useState } from "react";
import { getBookings } from "../api/bookingApi";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await getBookings();
      setBookings(res.data);
    };
    fetchBookings();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      {bookings.map(b => (
        <div key={b.id} className="border p-4 mb-2">
          <p>Seat: {b.seat_number}</p>
          <p>Status: {b.payment_status}</p>
        </div>
      ))}
    </div>
  );
};

export default BookingHistory;
