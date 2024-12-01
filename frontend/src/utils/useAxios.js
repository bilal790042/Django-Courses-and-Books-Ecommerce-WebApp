import axios from 'axios';
import { getRefreshedToken, isAccessTokenExpired, setAuthUser } from './auth';
import { API_BASE_URL } from './constants';
import Cookies from 'js-cookie';

const useAxios = () => {
    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");
    
    const axiosInstance = axios.create({
        baseURL: API_BASE_URL,
        headers: { Authorization: `Bearer ${accessToken}` } // Fixing space in Bearer token
    });

    axiosInstance.interceptors.request.use(
        async (req) => {
            // Check if the access token is expired
            if (!isAccessTokenExpired()) {
                return req;
            }

            try {
                // Get a refreshed token
                const response = await getRefreshedToken(refreshToken);

                // Update cookies with new tokens
                setAuthUser(response.data?.access, response.data?.refresh_token);

                // Update the request's Authorization header with the new token
                req.headers.Authorization = `Bearer ${response.data?.access}`;
                return req;
            } catch (error) {
                console.error("Error refreshing token:", error);
                // Optionally: Handle token refresh failure (e.g., log out user)
                throw error;
            }
        },
        (error) => {
            // Handle request errors
            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export default useAxios;
