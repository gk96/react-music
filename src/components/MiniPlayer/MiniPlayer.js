import React, { useContext, useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { useHistory } from "react-router-dom";
import {Link} from 'react-router-dom'
import './MiniPlayer.css';
import PlayerService from '../../services/PlayerService';

export default function MiniPlayer() {

    // const context = useContext(AppContext)
    const [context, dispatch] = useContext(AppContext);
    const history = useHistory()

    useEffect(() => {
        console.log(context)
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
    }

    function setPlayerApperance(e){
        PlayerService.setPlayerApperance(e, "max")
        setTimeout(() => {
            dispatch({type: "setPlayerState", snippet: "max"});
            history.push(`/player1/${context?.currentSongDetails?.videoId}`)}
            , 150); 
    }

    function openPlayer(e){
        e.preventDefault()
        console.log(document.getElementsByClassName("mini-player")[0])
        document.getElementsByClassName("mini-player")[0].style.height = 'calc(50%)'
        document.getElementsByClassName("mini-player")[0].style.transform = 'translateY(calc(-100%))'
        dispatch({type: "setCurrentSong", snippet: {
            videoId: context?.currentSongDetails?.videoId,
            trackTitle: context?.currentSongDetails?.trackTitle,
            albumArtUrl: context?.currentSongDetails?.albumArtUrl,
        }})
        //dispatch({type: "setPlayerState", snippet: "max"})
        
        setPlayerApperance(e)
    }


    return (
        <div className="mini-player" onClick={(e) => {openPlayer(e)}}>
            <div className="main-container">
                <div className="album-art">
                    {/* <img src="https://i.ytimg.com/vi/rpIlP6pI8fo/hqdefault.jpg?sqp=-oaymwEiCKgBEF5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLC3RB_yAndw0DHdAadz4bl1wNC12w"/> */}
                    <img style={{"width": "120%" }} src={context?.currentSongDetails?.albumArtUrl} /> 
                </div>
                
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
                <div>
                <button onClick={(e) => {playAudio(e)}}>
                    <span className="material-icons">{context.audioState === "paused" ? "play_arrow" : "pause"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
