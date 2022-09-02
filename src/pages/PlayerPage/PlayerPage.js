import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import './PlayerPage.css';
import RelatedVideos from '../../components/RelatedVideos/RelatedVideos';
import Player3 from '../../components/Player3/Player3';
import {Link, useHistory} from 'react-router-dom';
import PlayerService from '../../services/PlayerService';
// import Player1 from '../../components/Player1/Player1';


function PlayerPage(props){

    const [context, dispatch] = useContext(AppContext);
    const history = useHistory();
    var xDown = null;                                                        
    var yDown = null;

    // console.log(props)

    useEffect(() => {
        // document.addEventListener('touchstart', handleTouchStart, false);        
        // document.addEventListener('touchmove', handleTouchMove, false);
        //document.addEventListener('touchend', handleTouchEnd, false); 
        return ()=>{
            // document.removeEventListener('touchstart', handleTouchStart, false);        
            // document.removeEventListener('touchmove', handleTouchMove, false);
            //document.removeEventListener('touchend', handleTouchEnd, false); 
        }
    })

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
            <Player3 props={props}/>
            {/* <br /> */}
            <RelatedVideos props={props}/>
        </div>
        
        // </div>
        
    )
}

export default PlayerPage;