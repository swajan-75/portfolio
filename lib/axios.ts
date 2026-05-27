import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || (process.env.NODE_ENV === "production" ? "https://portfolio-backend-v2-4t2j.onrender.com/api/v1" : "http://localhost:8000/api/v1"),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

export default api