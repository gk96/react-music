import React from 'react'
import {Link} from 'react-router-dom'
import { routes } from '../../Routes';
import './Footer.css'

export default function Footer() {


    return (
        <div className="footerContainer">
            <ul>
                <li className='link-items'>
                <Link className='link-items' to={routes.find(x => x.key == "home")?.path} >
                    <span className="material-icons icon">home</span>
                    <span className='link-text'>Home</span>
                </Link>
                </li>

                <li className='link-items'>
                <Link className='link-items' to={routes.find(x => x.key == "search")?.path} >
                    <span className="material-icons icon">search</span>
                    <span className='link-text'>Search</span>
                </Link>
                </li>

                <li className='link-items'>
                <Link className='link-items' to={routes.find(x => x.key == "playlists")?.path} >
                    <span className="material-icons icon">list</span>
                    <span className='link-text'>Playlist</span>
                </Link>
                </li>

                <li className='link-items'>
                    <span className="material-icons icon">download</span>
                    <span className='link-text'>Downloads</span>
                </li>
            </ul>
        </div>
    );

}