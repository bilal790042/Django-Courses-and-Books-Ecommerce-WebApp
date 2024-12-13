import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

function UserData() {
  const access_token = Cookies.get("access_token");
  const refresh_token = Cookies.get("refresh_token");

  if (access_token && refresh_token) {
    try {
      const decoded = jwtDecode(refresh_token);
      return decoded;
    } catch (error) {
      console.error("Invalid refresh token:", error);
      return null; // Handle invalid token case
    }
  } 

  // If tokens are missing, return null
  return null;
}

export default UserData;
