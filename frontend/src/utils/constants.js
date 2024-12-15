    import UserData from "../views/plugin/UserData";

    export const API_BASE_URL = "http://127.0.0.1:8000/api/v1/";
    // export const userId = UserData()?.user_id ?? 1; // Default to 1 if user_id is undefined
    // export const userId = UserData()?.user_id || 1; // Fallback to 1
    // export const userId = UserData()?.user_id !== undefined ? UserData()?.user_id : 1;
    export const userId = UserData()?.user_id || 1; // Default fallback
    console.log("Resolved User ID:", userId);



    export const PAYPAL_CLIENT_ID = "test";
    console.log("UserData:", UserData());


    // console.log("User ID resolved as:", userId); // Debugging log
