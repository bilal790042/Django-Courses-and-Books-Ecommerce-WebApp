import { useAuthStore } from "../store/auth";
<<<<<<< HEAD
import axios from "./axios";
import jwt_decode from 'jwt-decode';

import Cookie from "js-cookie";
import Swal from 'sweetalert2';

export const login = async (email, password) => {
    try {
        const {data, status} = await axios.post('user/token/', {
            email, 
            password,
        });

        if (status === 200) {
=======
import axios from "axios";
import jwt_decode from "jwt-decode";
import cookie from "js-cookie";
import Swal from "sweetalert2";


export const login = async (email, password) =>{
    try {
        const {data, status } = await axios.post('user/token/',{
            email,
            password,
        });

        if(status ==200){
>>>>>>> 1bbff98875c35b903d465b59532f85bd7c28061d
            setAuthUser(data.access, data.refresh);
            alert("Login Successful");
        }

<<<<<<< HEAD
        return { data, error: null };
    } catch (error) {
        return {
            data: null,
            error: error.response.data?.detail || "something went wrong",
        };
    }
};


export const register = async (fullname, email, password, password2) => {
    try {
        const {data, status} = await axios.post('user/register', {
            full_name,
            email,
            password,
            password2,
        });

        await login (email, password);
        alert("Registeration Successful");
        return { data, error: null };

    } catch (error) {
        return {
            data: null,
            error: error.response.data?.details || "something went wrong"
        };
    }
};

export const logout = () => {
    Cookie.remove("access_token");
    Cookie.remove("refresh_token");
    useAuthStore.getState().setUser(null);
    alert("You have been logged out");
};

export  const setUser = async () => {
    const access_token = Cookie.get("access_token");
    const refresh_token = Cookie.get("refresh_token");

    if (!access_token || refresh_token) {
        // alert("Token does not exist");
        return;
    }

    if  (isAccessTokenExpired(access_token)) {
        const response = getRefreshToken(access_token);
        setAuthUser (response.access, response.refresh);
    } else {
        setAuthUser(access_token, refresh_token);
    }
};

export const setAuthUser = (access_token, refresh_token) => {
    Cookie.set('access_token', access_token, {
        expires: 7,
        secure: true,
    });
    const user = jwt-decode(access_token) ?? null

    if (user) {
        useAuthStore.getState().setUser(user);
    } else {
        setAuthUser.getState().setLoading(false);
    }
};

export const getRefreshedToken = async () => {
    const refresh_token = Cookie.get("refresh_token");
    const response = await axios.post('token/refresh/', {
=======
        return {data, error: null};
    } catch (error) {
       return{
        data: null,
        error: error.response.data?.detail || "Something went wrong",
       };
    }

};

export const register = async (full_name, email, password, password2)=> {
    try {
        const {data} = await axios.post('user/register/',{
            full_name,
            email, 
            password,
            password2,
        });
        await login(email, password);
        alert("Registration Successful");
        return{data, error:null};
    } catch (error) {
        return{
            data: null,
            error: error.response.data?.detail || "Something went wrong",
           };
    }
};
export const logout = () =>{
    cookie.remove("access_token");
    cookie.remove("refresh_token");
    useAuthStore.getState().setUser(null);
    alert("You have been logged out");
}; 
export const setUser = async () =>{
    const access_token = cookie.get("access_token");
    const refresh_token = cookie.get("refresh_token");

    if(!access_token ||!refresh_token){
        alert("Token does not exists ");
        return;
    }
    if(isAccessTokenExpired(access_token)){
        const response = getRefreshedToken(refresh_token);
        setAuthUser(response.access, response.refresh);
    }
    else{
        setAuthUser(access_token, refresh_token);
    }

};    

export const setAuthUser = (access_token, refresh_token) =>{
    cookie.set("access_token", access_token,{
        expires: 1,
        secure:true,
    });

    cookie.set("refresh_token", refresh_token,{
        expires: 7,
        secure:true,
    });
    const user = jwt_decode(access_token)?? null

    if(user){
        useAuthStore.getState().setUser(user);
    }
    useAuthStore.getState().setLoading(false);
   
};
export const getRefreshedToken =async () => {
    const refresh_token = cookie.get("refresh_token");
    const response = await axios.post('token/refresh/',{
>>>>>>> 1bbff98875c35b903d465b59532f85bd7c28061d
        refresh: refresh_token,
    });
    return response.data;
};
<<<<<<< HEAD

export const isAccessTokenExpired = (access_token) => {
    try {
        const decodedToken = jwt_decode(access_token);
        return  decodedToken.exp < Date.now() / 1000;
    } catch (error) {
        return true;
    }
};
=======
export const isAccessTokenExpired = (access_token) => {
    try {
        const decodedToken = jwt_decode(access_token);
        return decodedToken.exp<Date.now()/1000;
    } catch (error) {
        console.log(error);
        return true;
    }
}
>>>>>>> 1bbff98875c35b903d465b59532f85bd7c28061d
