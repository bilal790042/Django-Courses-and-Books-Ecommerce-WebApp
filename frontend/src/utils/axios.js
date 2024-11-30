<<<<<<< HEAD
import axios from 'axios'
import { API_BASE_URL } from "./constants"

const apiInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});
export default apiInstance
=======
import axios from "axios";

const apiInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1/",
    timeout: 10000,
    headers:{
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

export default apiInstance;
>>>>>>> 1bbff98875c35b903d465b59532f85bd7c28061d
