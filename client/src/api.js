import axios from "axios";

// Use relative URL for Vercel deployment (API routes are at /api/*)
const getBaseURL = () => {
  if (typeof window !== "undefined") {
    // In browser, use relative path for same-domain API
    return "/api";
  }
  return process.env.REACT_APP_API_URL || "http://localhost:5000/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let csrfTokenPromise = null;

const getCsrfToken = async () => {
  if (!csrfTokenPromise) {
    csrfTokenPromise = axios
      .get(`${getBaseURL()}/csrf-token`, { withCredentials: true })
      .then((res) => res.data.csrfToken)
      .catch((err) => null);
  }
  return csrfTokenPromise;
};

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    // Add CSRF token for state-changing requests
    if (
      ["post", "put", "patch", "delete"].includes(config.method?.toLowerCase())
    ) {
      const csrfToken = await getCsrfToken();
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }
    }

    // Note: HttpOnly cookie will be automatically sent with requests
    // We still keep Authorization header for backwards compatibility if a token exists in localStorage
    // from an old session, but new sessions use cookies heavily.
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
