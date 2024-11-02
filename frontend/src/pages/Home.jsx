import React, { useEffect, useState } from 'react';
import { BigLoadar, Container } from '../components';
import axios from 'axios';
import { selectCurrToken, selectCurrUser } from '../features/auth/authSilce';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
function Home({adminload}) {

  const user= useSelector(selectCurrUser);
  const token = useSelector(selectCurrToken);

  const welcome = user ? `Welcome  ${user.name}!` : 'Welcome Guest';
  const tokenabbr = `${token}...` 
  return (
    <div className='w-full py-8'>
      <Container>
        <div className='flex flex-wrap'>
          {welcome}
        </div>
        <div>
          <p>Token: {tokenabbr}</p>
        </div>

        <p><Link to="/dashboard">Go to all users</Link></p>
        {/* {
          adminload && <Admin />
        } */}
      </Container>
    </div>
  )
}

export default Home;