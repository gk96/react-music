import React from 'react'
import {Link} from 'react-router-dom'
import './Footer.css'

export default function Footer() {


    return (
        <div className="footerContainer">
            <ul>
                <li><Link style={{ textDecoration: 'none'}} to="/home" >Home</Link></li>
                <li><Link style={{ textDecoration: 'none'}} to="/" >Search</Link></li>
                <li>Downloads</li>
            </ul>
        </div>
    );

}