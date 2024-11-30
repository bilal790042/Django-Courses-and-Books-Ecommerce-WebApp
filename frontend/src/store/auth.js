<<<<<<< HEAD
import {create} from 'zustand'
import {mountStoreDevtool} from 'simple-zustand-devtools'

const useAuthStore = create((set, get) => ({
    allUserData: null,
    loading: false,

    use: () => ({
        user_id : get().allUserData?.user_id || null,
        username: get().allUserData?.username || null
    }),
    setUser: (user) => set({
        allUserData: user
    }),
    setLoading: (loading) => set({
        loading
    }),
    isLoggedIn: () => get().allUserData !== null,
}));

if (import.meta.env.DEV){
    mountStoreDevtool("Store", useAuthStore);
} 
export  { useAuthStore }
=======
import {create} from 'zustand';
import {mountStoreDevtool} from 'simple-zustand-devtools';

const useAuthStore = create((set, get) => ({
    allUserData: null,
    loading: false, 

    user: () => ({
        user_id: get().allUserData?.user_id || null,
        username: get().allUserData?.username || null,

    }),

    setUser: (user) =>
        set({
            allUserData:user,
        }), 

    setLoading: (loading) => set({loading}),

    isLoggedIn: () => get().allUserData !==null,
}));

if(import.meta.env.DEV) {
    mountStoreDevtool("store", useAuthStore);
}

export{useAuthStore};
>>>>>>> 1bbff98875c35b903d465b59532f85bd7c28061d
