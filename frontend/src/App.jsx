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
import ContactPage from './pages/ContactPage.jsx';
import ResetPasswordComplete from './pages/ResetPasswordComplete.jsx';
import About from './pages/About.jsx';
import axios from 'axios';
import { useSelector } from 'react-redux';
import CommingSoon from './pages/CommingSoon.jsx';
import Catalog from './pages/Catalog.jsx';
import CourseDetails from './pages/CourseDetails.jsx'

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
            <ResetPasswordComplete email={"sak*****@gamil.com"} />
          </OpenRoute>
        } />
        <Route path="about" element={
          <About />
        } />
        <Route path="contact" element={
          <ContactPage />
        } />

        <Route path='*' element={
          // <Error />
          <CommingSoon />
        } />

      </Routes>
    </div>
  )
}

export default App

