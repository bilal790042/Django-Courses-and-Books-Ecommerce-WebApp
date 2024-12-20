import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import MainWrapper from './layouts/MainWrapper';
import { useState, useEffect } from 'react';
import { useContext } from 'react';

import Register from '../src/views/auth/Register';
import Login from '../src/views/auth/Login';
import Logout from './views/auth/Logout';
import ForgotPassword from './views/auth/ForgotPassword';
import CreateNewPassword from './views/auth/CreateNewPassword';
import Index from './views/base/Index'; // Note uppercase
import CourseDetail from './views/base/CourseDetail';
import Cart from './views/base/Cart';
import { CartContext } from './views/plugin/Context';
import CartId from './views/plugin/cartId';
import apiInstance from './utils/axios';
import Checkout from './views/base/Checkout';
import Success from './views/base/Success';
import Search from './views/base/Search';
import StudentDashboard from './views/student/Dashboard';
import StudentCourses from './views/student/Courses';
import StudentCourseDetail from "./views/student/CourseDetail"
import MentoringSessions from "./views/student/MentoringSessions";


function App() {

  const [cartCount, setCartCount] = useState(0);
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    apiInstance.get(`course/cart-list/${CartId()}/`).then((res) => {
      setCartCount(res.data?.length);
    });
    console.log(cartCount);


    // useAxios()
    //   .get(`user/profile/${UserData()?.user_id}/`)
    //   .then((res) => {
    //     setProfile(res.data);
    //   });
  }, []);

  return (
    <CartContext.Provider value={[cartCount, setCartCount]}>
      <BrowserRouter>
        <MainWrapper>
          <Routes>
            <Route path="/register/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout/" element={<Logout />} />
            <Route path="/forgot-password/" element={<ForgotPassword />} />
            <Route path="/create-new-password/" element={<CreateNewPassword />} />
            {/* Base route */}
            <Route path="/" element={<Index />} />
            <Route path="/course-detail/:slug/" element={<CourseDetail />} />
            <Route path="/cart/" element={<Cart />} />
            <Route path="/Checkout/:order_oid" element={<Checkout />} />
            <Route path="/payment-success/:order_oid" element={<Success />} />
            <Route path="/Search/" element={<Search />} />


            {/* Student route */}
            <Route path = "/student/dashboard/" element = {<StudentDashboard/>}/>
            <Route path = "/student/courses/" element = {<StudentCourses/>}/>
            <Route path = "/student/courses/:enrollment_id" element = {<StudentCourseDetail/>}/>

            {/* Student mentoring sessions */}
            <Route path="/student/mentoring-sessions" element={<MentoringSessions />} />



          </Routes>
        </MainWrapper>
      </BrowserRouter>
    </CartContext.Provider>
  );
}

export default App;


// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App;
