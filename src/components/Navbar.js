import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { removeToken, getToken } from "../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = getToken();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <Link to="/" className="font-bold">BussSpot</Link>
      <div>
        {isLoggedIn ? (
          <>
            <Link to="/booking-history" className="mr-4">Bookings</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
