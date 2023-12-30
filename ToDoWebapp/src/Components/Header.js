import React from 'react'
import SideBar from './SideBar'
import '../index.css';

function Header() {
     return (
          <div>
               <SideBar pageWrapId={'page-wrap'} outerConatainerId={'outer-container'}/>
               <div className='header'>
                    <h1>To Do</h1>
               </div>
          </div>
     )
}

export default Header