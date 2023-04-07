import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import './PlayerPage.css';
import RelatedVideos from '../../components/RelatedVideos/RelatedVideos';
// import Player3 from '../../components/Player3/Player3';
import {Link, useHistory, useLocation} from 'react-router-dom';
import PlayerService from '../../services/PlayerService';
import Player2 from '../../components/Player2/Player2';
import Player3 from '../../components/Player3/Player3';
import Player4 from '../../components/Player4/Player4';
import Playlist from '../../components/Playlist/Playlist';


function PlayerPage(props){

    const [context, dispatch] = useContext(AppContext);
    const location = useLocation();
    const playlistId = new URLSearchParams(location.search).get('playlistId');
    const songId = new URLSearchParams(location.search).get('songId');
    const history = useHistory();
    var xDown = null;                                                        
    var yDown = null;

    // console.log(props)

    useEffect(() => {
        console.log(playlistId)
        // document.addEventListener('touchstart', handleTouchStart, false);        
        // document.addEventListener('touchmove', handleTouchMove, false);
        //document.addEventListener('touchend', handleTouchEnd, false); 
        
        return ()=>{
            // document.removeEventListener('touchstart', handleTouchStart, false);        
            // document.removeEventListener('touchmove', handleTouchMove, false);
            //document.removeEventListener('touchend', handleTouchEnd, false); 
        }
    },[])

    function setPlayerState(e){
        PlayerService.setPlayerApperance(e, "min")
        dispatch({type: "setPlayerState", snippet: "min"});
        setTimeout(() => history.push("/"), 150);
      }

      



function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     
                                                                         
function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                
                                                                         
function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
                                                                         
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* right swipe */ 
        } else {
            /* left swipe */
        }                       
    } else {
        if ( yDiff > 0 ) {
            /* down swipe */ 
            
        } else { 
            /* up swipe */
            console.log("down swipe")
            setPlayerState(evt)
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};

function handleTouchEnd(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};  

    return(
        // <div>
        <div className="PlayerPage">
            <button style={{ float: 'left'}} >
            <Link onClick={(e) => {setPlayerState(e)}} style={{ textDecoration: 'none'}} to="/" className="material-icons">keyboard_arrow_down</Link>
            </button>
            {/* <Player1 props={props}/> */}
            {/* <Player2 props={props}/> */}
            {/* <Player3 props={props}/> */}
            <Player4 props={props}/>
            {/* <br /> */}
            {playlistId == 'undefined' || playlistId == null ? <RelatedVideos props={props}/> : <Playlist props={props} />}
            
            
            
        </div>
        
        // </div>
        
    )
}

export default PlayerPage;