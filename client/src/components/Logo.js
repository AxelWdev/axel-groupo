import React from 'react';
import {Link} from 'react-router-dom';
import logo from '../assets/icon-left-font-monochrome-black.svg'

function Logo(){
    return (<>
            <Link to = '/'> 
                <div className="logo-container">
                    <img src ={logo} alt='Logo' className='logo'/>
                </div>
            </Link></>)
}
export default Logo;