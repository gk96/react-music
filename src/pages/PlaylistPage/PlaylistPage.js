import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import './PlaylistPage.css';
import RelatedVideos from '../../components/RelatedVideos/RelatedVideos';
// import Player3 from '../../components/Player3/Player3';
import {Link, useHistory} from 'react-router-dom';
import PlayerService from '../../services/PlayerService';
import { CircularProgress } from '@material-ui/core';


function PlaylistPage(props){

    const [playlistItems, setPlaylistItems] = useState();
    const [loader, setLoader] = useState(false);
    const [context, dispatch] = useContext(AppContext);
    const history = useHistory();

    // console.log(props)

    useEffect(() => {
        // document.addEventListener('touchstart', handleTouchStart, false);        
        // document.addEventListener('touchmove', handleTouchMove, false);
        //document.addEventListener('touchend', handleTouchEnd, false); 
        setLoader(true);
        getPlaylists().then(async (res) => {
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

    function getPlaylists(){
        return fetch(`${process.env.REACT_APP_API_BASE_URL}/api/ytdl/playlists`, {
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
            <div className='playlist-container'>{ loader ? <div style={{paddingTop: '50%' }}><CircularProgress /></div> :
            playlistItems?.map((r) =>{
                // console.log(r?.snippet?.thumbnails)
                return(
                // <li key={r?.id?.videoId}>
                <div className="list-item">
                    <Link className='list-item-link' key={r?.PlaylistId} to={`/playlist?playlistId=${r?.PlaylistId}`}>
                        <img alt='' src={r?.Thumbnail} />
                        <div>
                            {r?.PlaylistName}  
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

export default PlaylistPage;