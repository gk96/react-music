import React, { useContext, useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { useHistory } from "react-router-dom";
import {Link} from 'react-router-dom'
import './MiniPlayer.css';
import PlayerService from '../../services/PlayerService';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function MiniPlayer() {

    // const context = useContext(AppContext)
    const [context, dispatch] = useContext(AppContext);
    const history = useHistory()

    useEffect(() => {
        // console.log(context)
    }, [context.currentSongDetails])
    
    function playAudio(e){
        e.stopPropagation()
        if (context.audioState === "playing"){
            //  setIsPlaying(false);
             context.me.pause();
            //  span.innerHTML = 'play_arrow'
             dispatch({type: "setAudioState", snippet: "paused"})
           }
           else if(context.audioState === "paused"){
            //  setIsPlaying(true);
             context.me.play()
            //  span.innerHTML = 'pause'
             dispatch({type: "setAudioState", snippet: "playing"})
           }
           else if(context.audioState === "error"){
            dispatch({type: "setAudioState", snippet: "error"})
           }
    }

    function setPlayerApperance(e){
        PlayerService.setPlayerApperance(e, "max")
        setTimeout(() => {
            dispatch({type: "setPlayerState", snippet: "max"});
            history.push(`/player?songId=${context?.currentSongDetails?.videoId}`)}
            , 200); 
    }

    function openPlayer(e){
        e.preventDefault()
        // console.log(document.getElementsByClassName("mini-player")[0])
        // document.getElementsByClassName("mini-player")[0].style.height = '50vh'
        // document.getElementsByClassName("mini-player")[0].style.transform = 'translateY(calc(-300%))'
        dispatch({type: "setCurrentSong", snippet: {
            videoId: context?.currentSongDetails?.videoId,
            trackTitle: context?.currentSongDetails?.trackTitle,
            albumArtUrl: context?.currentSongDetails?.albumArtUrl,
        }})
        //dispatch({type: "setPlayerState", snippet: "max"})
        setPlayerApperance(e)
    }

    function setPlayButton(){
        switch(context.audioState){
          case "paused":
            return "play_arrow"
          case "playing":
            return "pause"
          case "error":
            return "music_off"
          default:
            return "play_arrow"
        }
      }

    return (
        <div className="mini-player" onClick={(e) => {openPlayer(e)}}>
            {/* <div className="main-container"> */}
                <div class="album-art image-box">
                    <img src={context?.currentSongDetails?.albumArtUrl} alt="album art" />
                </div>
            
                {/* <div className="album-art"> */}
                    {/* <img src="https://i.ytimg.com/vi/rpIlP6pI8fo/hqdefault.jpg?sqp=-oaymwEiCKgBEF5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLC3RB_yAndw0DHdAadz4bl1wNC12w"/> */}
                    {/* <img src={context?.currentSongDetails?.albumArtUrl} />  */}
                {/* </div> */}
                
                <div id="scroll-container">
                    <div id="scroll-text">{context?.currentSongDetails?.trackTitle}</div>
                </div>
                {/* <div className="title">
                    {
                    <Link  to= 
                    {{
                        pathname :`/player1/${context.currentSongDetails?.videoId}`,
                        // state : {
                        //     albumArtUrl: r?.thumbnails[0].url,
                        //     videoId: r?.videoId,
                        //     title: r?.title
                        // }
                    }}>
                        }
                    <h4>{context.currentSongDetails?.trackTitle}</h4>
                    {/* </Link> 
                    </div> */}
                {context.bufferState === "loading" ?
                <div><CircularProgress /></div> :
                <div style={{"display": "flex", "justifyContent": "center", "flexDirection": "column" }}>
                <button onClick={(e) => {playAudio(e)}}>
                    <span className="material-icons">{setPlayButton()}</span>
                    </button>
                </div>
                }       
            {/* </div> */}
        </div>
    );
}
