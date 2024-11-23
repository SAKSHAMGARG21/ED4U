import React from 'react'
import logo from "../../assets/Logo/Ed4u_logo.png"
function Logo() {
  return (
    <div>
        <img src={logo} alt="Ed4U" width={80} height={42} loading='lazy' />
    </div>
  )
}

export default Logo