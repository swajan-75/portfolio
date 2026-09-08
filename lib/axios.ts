import axios from "axios";

const api = axios.create({
  baseURL: typeof window !== "undefined" ? "/api/v1" : (process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-two-chi-91.vercel.app/api/v1"),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

export default api