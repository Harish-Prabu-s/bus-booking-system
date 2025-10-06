const token = localStorage.getItem("access");

const res = await axios.get(
  "http://127.0.0.1:8000/api/routes/",
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
    