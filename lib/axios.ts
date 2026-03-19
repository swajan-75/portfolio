import axios from "axios";

const api = axios.create({
    baseURL : "https://portfolio-backend-v2-4t2j.onrender.com/api/v1",
    withCredentials : true,
    headers: {
    "Content-Type": "application/json",
  },
})

export default api