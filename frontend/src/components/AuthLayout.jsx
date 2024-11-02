import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import { selectCurrToken } from '../features/auth/authSilce'

export default function Protected() {
    const token = useSelector(selectCurrToken);
    const location = useLocation();
    console.log(token);
    // useEffect(() => {
    //     //TODO: make it more easy to understand

    //     // if (authStatus ===true){
    //     //     navigate("/")
    //     // } else if (authStatus === false) {
    //     //     navigate("/login")
    //     // }

    //     //let authValue = authStatus === true ? true : false

    //     if (authentication && authStatus !== authentication) {
    //         navigate("/login")
    //     } else if (!authentication && authStatus !== authentication) {
    //         navigate("/")
    //     }
    //     setLoader(false);
    // }, [authStatus, navigate, authentication])

    // return loader ? <h1>Loading...</h1> :
    //     <>
    //         {showNavBar && <Header />}
    //         {children}
    //         {showFooter && <Footer />}
    //     </>

    return token ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />

}