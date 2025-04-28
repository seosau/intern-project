import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api", // hoặc URL server của bạn
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
