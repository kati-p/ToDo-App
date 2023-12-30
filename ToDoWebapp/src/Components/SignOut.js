import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import SideBar from './SideBar';
import Header from './Header';

function SignOut() {

  const [cookie, removeCookie] = useCookies(['token']);
  const navigate = useNavigate();

  useEffect( () => {
    removeCookie('token');
    navigate('/signin');
  },[]);

  return (
    <div>
      <Header/>
      <div>
          <center style={{position:'relative'}}><h1>กำลังออกจากระบบ</h1></center>
      </div>
    </div>
  )
}

export default SignOut;