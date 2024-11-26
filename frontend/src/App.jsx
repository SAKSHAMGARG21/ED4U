import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Navbar from './components/common/Navbar.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import UpdatePassword from './pages/updatePassword.jsx';
import OpenRoute from './components/Core/Auth/OpenRoute.jsx';
import PrivateRoute from './components/Core/Auth/PrivateRoute.jsx';
import Error from './pages/Error.jsx';
import ContactPage from './pages/ContactPage.jsx';
import ResetPasswordComplete from './pages/ResetPasswordComplete.jsx';
import MyProfile from './components/Core/Dashboard/MyProfile.jsx';
import Dashboard from './pages/Dashboard.jsx';
import About from './pages/About.jsx';
import axios from 'axios';
import AddCourse from './components/Core/Dashboard/Add Course/index.jsx';
import MyCourses from './components/Core/Dashboard/MyCourses.jsx';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ACCOUNT_TYPE } from './utils/constants.js';
import Instructor from './components/Core/Dashboard/Instructor.jsx';
import CommingSoon from './pages/CommingSoon.jsx';
import Catalog from './pages/Catalog.jsx';
import CourseDetails from './pages/CourseDetails.jsx'
import EnrolledCourses from './components/Core/Dashboard/EnrolledCourses.jsx';
import ViewCourse from './pages/ViewCourse.jsx';
import VideoDetails from './components/Core/ViewCourse/VideoDetails.jsx';


function App() {
  const { user } = useSelector((state) => state.profile);

  axios.defaults.withCredentials = true;
  return (
    <div>
      {/* <Home></Home> */}
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="catalog/:catalogName" element={<Catalog />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />

        <Route path="login" element={
          <OpenRoute>
            <Login />
          </OpenRoute>
        } />
        <Route path="signup" element={
          <OpenRoute>
            <Signup />
          </OpenRoute>} />
        <Route path="verify-email" element=
          {
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          } />
        <Route path="forgot-password" element={
          <OpenRoute>
            <ForgotPassword />
          </OpenRoute>
        } />
        <Route path="update-password/:token" element={
          <OpenRoute>
            <UpdatePassword />
          </OpenRoute>
        } />
        <Route path="resetcomplete" element={
          <OpenRoute>
            <ResetPasswordComplete email={"saksham@gamil.com"} />
          </OpenRoute>
        } />
        <Route path="about" element={
          <About />
        } />
        <Route path="contact" element={
          <ContactPage />
        } />

        <Route element={<PrivateRoute><Dashboard /></PrivateRoute>} >

          <Route path='dashboard/my-profile' element={<MyProfile />}></Route>
          {/* <Route path='dashboard/settings' element={<Settings />}></Route>*/}
          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                {/* <Route path='dashboard/cart' element={<Cart />}></Route> */}
                <Route path='dashboard/enrolled-courses' element={<EnrolledCourses />}></Route>
              </>
            )
          }

          {
            user?.accountType == ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path='dashboard/instructor' element={<Instructor />}></Route>
                <Route path='dashboard/my-courses' element={<MyCourses />}></Route>
                <Route path='dashboard/add-course' element={<AddCourse />}></Route>
                {/* <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} /> */}
              </>
            )
          }

        </Route>

        <Route element={<PrivateRoute><ViewCourse /></PrivateRoute>}>
          {
            user?.accountType == ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path='view-course/:courseId/section/:sectionId/sub-section/:subsectionId'
                  element={<VideoDetails />} >
                </Route>
              </>
            )
          }
        </Route>

        <Route path='*' element={
          // <Error />
          <CommingSoon />
        } />

      </Routes>
    </div>
  )
}

export default App

