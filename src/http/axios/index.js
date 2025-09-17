import axios from 'axios'

const API_URL = import.meta.env.VITE_BACKEND_URL
const API_TOKEN = import.meta.env.VITE_API_TOKEN

export default axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_TOKEN}`, // 👈 Attach token here
  },
  withCredentials: true, // optional: only if using cookies/auth
})
