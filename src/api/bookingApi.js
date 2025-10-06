import axios from "axios";
import { getToken } from "../utils/auth";

const API_URL = "http://localhost:8000/api/";

export const bookTicket = (data) =>
  axios.post(API_URL + "bookings/", data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

export const getBookings = () =>
  axios.get(API_URL + "bookings/", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
