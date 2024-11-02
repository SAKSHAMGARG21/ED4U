import { useState, useEffect } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom';

function App() {


  return (
    <>
      <Outlet></Outlet>
      {/* <h1>this is home page</h1> */}
    </>
  )
}

export default App
