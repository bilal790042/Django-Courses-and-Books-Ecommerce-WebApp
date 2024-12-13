import { useAuthStore } from "../store/auth";
import axios from "./axios";
import jwt_decode from "jwt-decode";
import Cookie from "js-cookie";
import Swal from "sweetalert2";

// Login function
export const login = async (email, password) => {
  try {
    const { data, status } = await axios.post(`user/token/`, {
      email,
      password,
    });

    if (status === 200) {
      console.log("Login successful. Setting auth tokens.");
      setAuthUser(data.access, data.refresh);
    }

    return { data, error: null };
  } catch (error) {
    console.error("Login failed:", error);
    return {
      data: null,
      error: error.response?.data?.detail || "Something went wrong",
    };
  }
};

// Register function
export const register = async (full_name, email, password, password2) => {
  try {
    const { data } = await axios.post(`user/register/`, {
      full_name,
      email,
      password,
      password2,
    });

    console.log("Registration successful. Logging in.");
    await login(email, password);
    return { data, error: null };
  } catch (error) {
    console.error("Registration failed:", error);
    return {
      data: null,
      error:
        `${error.response?.data?.full_name} - ${error.response?.data?.email}` ||
        "Something went wrong",
    };
  }
};

// Logout function
export const logout = () => {
  Cookie.remove("access_token");
  Cookie.remove("refresh_token");
  useAuthStore.getState().setUser(null);
  console.log("User logged out.");
};

// Token refresh logic
export const getRefreshedToken = async () => {
  const refresh_token = Cookie.get("refresh_token");

  if (!refresh_token) {
    console.error("No refresh token found.");
    throw new Error("No refresh token.");
  }

  try {
    const response = await axios.post(`user/token/refresh/`, {
      refresh: refresh_token,
    });
    console.log("Token refresh response:", response?.data);
    return response?.data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

// Set authenticated user and cookies
export const setAuthUser = (access_token, refresh_token) => {
  Cookie.set("access_token", access_token, {
    expires: 1,
    secure: true,
  });

  Cookie.set("refresh_token", refresh_token, {
    expires: 7,
    secure: true,
  });

  try {
    console.log("Token being decoded:", access_token);
    const user = jwt_decode(access_token) ?? null;

    if (user) {
      console.log("Decoded user:", user);
      useAuthStore.getState().setUser(user);
    } else {
      console.error("Decoded token invalid.");
      useAuthStore.getState().setUser(null);
    }
  } catch (error) {
    console.error("Failed to decode token:", error);
    useAuthStore.getState().setUser(null);
  }

  useAuthStore.getState().setLoading(false);
};

// Handle expired token and refresh logic
export const setUser = async () => {
  const access_token = Cookie.get("access_token");
  const refresh_token = Cookie.get("refresh_token");

  if (!access_token || !refresh_token) {
    console.error("Tokens are missing.");
    return;
  }

  try {
    if (isAccessTokenExpired(access_token)) {
      console.log("Token expired, attempting to refresh...");
      const response = await getRefreshedToken();
      if (response?.access && response?.refresh) {
        console.log("Token refreshed successfully.");
        setAuthUser(response.access, response.refresh);
      } else {
        console.error("Failed to refresh token.");
        logout();
      }
    } else {
      console.log("Token is still valid.");
      setAuthUser(access_token, refresh_token);
    }
  } catch (error) {
    console.error("Error during token refresh:", error);
    logout();
  }
};

// JWT token expiration check
export const isAccessTokenExpired = (access_token) => {
  try {
    const decodedToken = jwt_decode(access_token);
    const expired = decodedToken?.exp < Date.now() / 1000;
    console.log("Token expiration status:", expired);
    return expired;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // Treat as expired if decoding fails
  }
};