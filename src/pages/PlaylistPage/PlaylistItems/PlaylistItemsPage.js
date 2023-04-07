import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/AppContext';
import './PlaylistItemsPage.css';
// import Player3 from '../../components/Player3/Player3';
import {Link, useHistory, useLocation} from 'react-router-dom';
import PlayerService from '../../../services/PlayerService';
import { CircularProgress } from '@material-ui/core';


function PlaylistItemsPage(props){

    const [playlistItems, setPlaylistItems] = useState();
    const [loader, setLoader] = useState(false);
    const [context, dispatch] = useContext(AppContext);
    const location = useLocation();
    const playlistId = new URLSearchParams(location.search).get('playlistId');

    // console.log(props)

    useEffect(() => {
        // document.addEventListener('touchstart', handleTouchStart, false);        
        // document.addEventListener('touchmove', handleTouchMove, false);
        //document.addEventListener('touchend', handleTouchEnd, false); 
        setLoader(true);
        getPlaylistItems(playlistId).then(async (res) => {
            let items = await res.json();
            setPlaylistItems([...items]);
            setLoader(false);
        })
        
        return ()=>{
            // document.removeEventListener('touchstart', handleTouchStart, false);        
            // document.removeEventListener('touchmove', handleTouchMove, false);
            //document.removeEventListener('touchend', handleTouchEnd, false); 
        }
    }, [])

    function getPlaylistItems(playlistId){
        return fetch(`${process.env.REACT_APP_API_BASE_URL}/api/ytdl/playlist?playlistId=${playlistId}`, {
          //`http://192.168.0.103:3003/api/related-videos?videoId=${videoId}`, {
          headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
        });
    }

    return(
        // <div>
        <div className="PlaylistPage">
            <div className='playlistitems-container'>{ loader ? <div style={{paddingTop: '50%' }}><CircularProgress /></div> :
            playlistItems?.map((r) =>{
                // console.log(r?.snippet?.thumbnails)
                return(
                // <li key={r?.id?.videoId}>
                <div className="list-item">
                    <Link className='list-item-link' to={`/player?songId=${r?.songId}&playlistId=${playlistId}`}>
                        <img alt='' src={r?.thumbnail} />
                        <div>
                            {r?.title}  
                         </div>
                    </Link>
                </div>
                );
                // return <li onClick={playSong} key={r?.id?.videoId}>{r?.title}</li>
            })
            }</div>
        </div>
        
        // </div>
        
    )
}

export default PlaylistItemsPage;