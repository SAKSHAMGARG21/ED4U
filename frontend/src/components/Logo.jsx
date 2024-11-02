import React from 'react'
import { Link } from 'react-router-dom'
import imageurl from "../assets/Ed4U_logo.png";
function Logo({ width = '100px' }) {
  return (
    <div className={`${width} flex items-center gap-2 text-black font-bold`}>
      <div className='h-12 w-12'>
      <img src={imageurl} alt="Logo" className='rounded-lg' />
      </div>
      <Link to={"/"}>
        Ed4U
      </Link>
    </div>
  )
}

export default Logo