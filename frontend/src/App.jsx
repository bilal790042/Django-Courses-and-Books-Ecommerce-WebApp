import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import MainWrapper from './layouts/MainWrapper';
import { useState, useEffect, useContext } from 'react';
// import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import { AuthProvider } from './views/base/AuthContext';

import Register from '../src/views/auth/Register';
import Login from '../src/views/auth/Login';
import Logout from './views/auth/Logout';
import ForgotPassword from './views/auth/ForgotPassword';
import CreateNewPassword from './views/auth/CreateNewPassword';
import Index from './views/base/Index'; // Note uppercase
import CourseDetail from './views/base/CourseDetail';
import Cart from './views/base/Cart';
import { CartContext, ProfileContext } from './views/plugin/Context';
import CartId from './views/plugin/cartId';
import apiInstance from './utils/axios';
import Checkout from './views/base/Checkout';
import Success from './views/base/Success';
import Search from './views/base/Search';
import StudentDashboard from './views/student/Dashboard';
import StudentCourses from './views/student/Courses';
import StudentCourseDetail from "./views/student/CourseDetail"
import MentoringSessions from "./views/student/MentoringSessions"
import Books from './views/base/books';
import Wishlist from "./views/student/Wishlist";
import StudentProfile from "./views/student/Profile";
import useAxios from "./utils/useAxios";
import UserData from "./views/plugin/UserData";
import StudentChangePassword from "./views/student/ChangePassword";
import Dashboard from "./views/instructor/Dashboard";
import Courses from "./views/instructor/Courses";
import Review from "./views/instructor/Review";
import Students from "./views/instructor/Students";
import Earning from "./views/instructor/Earning";
import Orders from "./views/instructor/Orders";
import Coupon from "./views/instructor/Coupon";
import TeacherNotification from "./views/instructor/TeacherNotification";
import QA from "./views/instructor/QA";
import ChangePassword from "./views/instructor/ChangePassword";
import Profile from "./views/instructor/Profile";
import CourseCreate from "./views/instructor/CourseCreate";
import CourseEdit from "./views/instructor/CourseEdit";
import BookDetail from './views/base/bookDetail';
import AddBook from './views/instructor/addBook';
import BaseFooter from './views/partials/BaseFooter';

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    apiInstance.get(`course/cart-list/${CartId()}/`).then((res) => {
      setCartCount(res.data?.length);
    });
    console.log(cartCount);

    useAxios().get(`user/profile/${UserData()?.user_id}/`)
      .then((res) => {
        setProfile(res.data);
      });
  }, []);

  return (
    <AuthProvider> {/* Wrap your app with AuthProvider */}
      <CartContext.Provider value={[cartCount, setCartCount]}>
        <ProfileContext.Provider value={[profile, setProfile]}>
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
                <Route path="/student/dashboard/" element={<StudentDashboard />} />
                <Route path="/student/courses/" element={<StudentCourses />} />
                <Route path="/student/courses/:enrollment_id" element={<StudentCourseDetail />} />
                <Route path="/student/wishlist/" element={<Wishlist />} />
                <Route path="/student/profile/" element={<StudentProfile />} />
                <Route path="/student/change-password/" element={<StudentChangePassword />} />
                {/* Student mentoring sessions */}
                <Route path="/student/mentoring-sessions" element={<MentoringSessions />} />
                <Route path="/books" element={<Books />} />

                {/* Teacher Routes */}
                <Route path="/instructor/dashboard/" element={<Dashboard />} />
                <Route path="/instructor/courses/" element={<Courses />} />
                <Route path="/instructor/reviews/" element={<Review />} />
                <Route path="/instructor/students/" element={<Students />} />
                <Route path="/instructor/earning/" element={<Earning />} />
                <Route path="/instructor/orders/" element={<Orders />} />
                <Route path="/instructor/coupon/" element={<Coupon />} />
                <Route path="/instructor/notifications/" element={<TeacherNotification />} />
                <Route path="/instructor/question-answer/" element={<QA />} />
                <Route path="/instructor/change-password/" element={<ChangePassword />} />
                <Route path="/instructor/profile/" element={<Profile />} />
                <Route path="/instructor/create-course/" element={<CourseCreate />} />
                <Route path="/instructor/edit-course/:course_id/" element={<CourseEdit />} />

                <Route path="/books/books-detail/:id/" element={<BookDetail />} />
                <Route path="/books/create/" element={<AddBook />} />

                <Route path="/pages/about-us/" element={<BaseFooter />} />
                <Route path="/pages/contact-us/" element={<BaseFooter />} />

              </Routes>
            </MainWrapper>
          </BrowserRouter>
        </ProfileContext.Provider>
      </CartContext.Provider>
    </AuthProvider>
  );
}

export default App;