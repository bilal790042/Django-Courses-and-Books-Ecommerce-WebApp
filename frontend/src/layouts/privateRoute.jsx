import { useEffect } from "react";
import { useAuthStore } from "../store/auth";  

const PrivateRoute = ({children}) => {
    const loggedIn = useAuthStore((state) => state.isLoggedIn());

    return loggedIn ? <> {children} </> : <Navigate to = "/login/" />
};

export default PrivateRoute;