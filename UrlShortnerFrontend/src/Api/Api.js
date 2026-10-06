import axios from "axios"

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8080",
  withCredentials: true,
})

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token")

  if (token) {
    req.headers.Authorization = `Bearer ${token}`
  }

  return req
})

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/api/auth/public") &&
      !originalRequest.url.includes("/api/auth/refresh") &&
      !originalRequest.url.includes("/api/auth/me")
    ) {
      originalRequest._retry = true
      try {
        const refreshResponse = await API.post("/api/auth/refresh")
        if (refreshResponse.data && refreshResponse.data.token) {
          localStorage.setItem("token", refreshResponse.data.token)
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`
        }
        return API(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem("token")
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default API