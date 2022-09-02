import React from 'react';
import { useEffect, useState, useContext} from 'react';
import './Player2.css';
import {useParams, useHistory} from 'react-router-dom'
 import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Link} from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import PlayerService from '../../services/PlayerService';
import SeekBar from '../SeekBar/SeekBar';


function Player2() {
  const { videoId } = useParams();
  const history = useHistory();
  //var me = document.createElement('audio');
  //var mediaSource
    // console.log(props);
    const [context, dispatch] = useContext(AppContext)
    var me = context.me;
    const [loading, setLoading] = useState(false);
    const [dm, setdm] = useState(0);
    const [ds, setds] = useState(0);
    const [cm, setcm] = useState(0);
    const [cs, setcs] = useState(0);
    
    useEffect(() => {
        window.onpopstate = () =>{
            history.push("/");
        }
    })
   
    useEffect(() => {
      // setLoading(true)
      console.log('use effect')
      console.log(videoId)
      //document.getElementsByTagName('audio').src = `${process.env.REACT_APP_API_BASE_URL}/download-video-ytdl-tester?path=https://www.youtube.com/watch?v=${videoId}`
      console.log(console.log(context.currentSongDetails))
      console.log(Object.keys(context.currentSongDetails).length)
      if (Object.keys(context.currentSongDetails).length == 0)
      {
        dispatch({type: "setBufferState", snippet: "loading"})

        PlayerService.getVideoInfo(videoId).then((r) => {

          console.log(r?.thumbnails[r?.thumbnails?.length - 1]?.url)
          dispatch({type: "setCurrentSong", snippet: {
            videoId: videoId,
            trackTitle: r?.title,
            albumArtUrl: r?.thumbnails[r?.thumbnails?.length - 1]?.url,
        }});
        PlayerService.setAudioSource(videoId, context).then(() => {
            dispatch({type: "setBufferState", snippet: "loaded"})
          });
        });
      }


      me?.addEventListener('loadedmetadata', loadedmetadata);
      
      me?.addEventListener('progress',  progress);
    
      me?.addEventListener('timeupdate', timeupdate);
     
      setNotificationLabel();

      dispatch({type: "setPlayerState", snippet: "max"})

      // Clean Up
    return () => {

      me?.removeEventListener('progress', progress);
      me?.removeEventListener('timeupdate', timeupdate);
      dispatch({type: "setPlayerState", snippet: "min"})
     
    }
   }, [context.currentSongDetails]);
  

   function playAudio(e){
    e.preventDefault();

    console.log(context.audioState)

    switch(context.audioState){
      case "playing":
        dispatch({type: "setAudioState", snippet: "paused"})
        break;
      case "paused":
        dispatch({type: "setAudioState", snippet: "playing"})
        break;

    }
  }
   
   function loadedmetadata(){
    setds(parseInt(me.duration % 60))
    setdm(parseInt((me.duration / 60) % 60))

    if(me.duration > 0){
      setcs(parseInt(me.currentTime % 60))
      setcm(parseInt((me.currentTime / 60) % 60))
    }
    setLoading(false)
    dispatch({type: "setAudioState", snippet: "playing"})
    
   }

   function progress(){
    console.log('add to buffer')
    var duration =  me.duration;
    if (me.duration > 0) {
      for (var i = 0; i < me.buffered.length; i++) {
            if (me.buffered.start(me.buffered.length - 1 - i) < me.currentTime) {
                //document.getElementById("buffered-amount").style.width = (me.buffered.end(me.buffered.length - 1 - i) / duration) * 100 + "%";
                // me.play()
                // console.clear()
                console.log("Buffering =>" ,((me.buffered.end(me.buffered.length - 1 - i) / me.duration) * 100).toFixed(0) + "%")
                // break;
            }
        }
    }
   }

   function timeupdate(){
    var duration =  me.duration;
    setds(parseInt(me.duration % 60))
    setdm(parseInt((me.duration / 60) % 60))

    if (duration > 0) {
      setcs(parseInt(me.currentTime % 60))
      setcm(parseInt((me.currentTime / 60) % 60))
      //document.getElementById('progress-amount').style.width = ((me.currentTime / duration)*100) + "%";
      //document.getElementById('progress-scrub').style.left = (me.currentTime / duration)*100 + "%";
    }
   }

   function setNotificationLabel(){

    if ('mediaSession' in navigator) {
      console.log("media session works")
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: context.currentSongDetails.trackTitle,
      artwork: [
        {
          src: context.currentSongDetails.albumArtUrl == null || undefined ? '' : context.currentSongDetails.albumArtUrl,
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    })

    navigator.mediaSession.setActionHandler('play', function() { dispatch({type: "setAudioState", snippet: "playing"}) });
    navigator.mediaSession.setActionHandler('pause', function() { dispatch({type: "setAudioState", snippet: "paused"}) });
  }
   }
    
    
    
  function playAudio(e){
    e.preventDefault();

    console.log(context.audioState)

    switch(context.audioState){
      case "playing":
        dispatch({type: "setAudioState", snippet: "paused"})
        break;
      case "paused":
        dispatch({type: "setAudioState", snippet: "playing"})
        break;

    }
  }

 

    // function setPlayerState(e){
    //   PlayerService.setPlayerApperance(e, "min")
    //   dispatch({type: "setPlayerState", snippet: "min"});
    //   setTimeout(() => history.push("/"), 150);
    // }
 

  return (

    <div className="playerContainer">
      
      
    <div className="bgImg" style={{backgroundImage: `url(${context?.currentSongDetails?.albumArtUrl})`}}></div>
    <div className="Player">
        <div className="AlbumArt" >
            <img src={context?.currentSongDetails?.albumArtUrl} />
        </div>
        
        <div id="scroll-container">
            <div id="scroll-text">{context?.currentSongDetails?.trackTitle}</div>
        </div>

        {/* <div>
        <h4> {context?.currentSongDetails?.trackTitle} </h4> 
        </div> */}
        <SeekBar />
        <div id="timeLine">
        <div>{loading ? "0:00" : cm.toString() + ":" +cs.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}</div>
        <div>{loading ? "0:00" : dm.toString() + ":" +ds.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}</div>
        </div>
        {/* <div className="Seekbar"> */}
        {/* <audio controls crossOrigin="anonymous" id="audio">
          <source id="source">
          </source>
        </audio> */}
        
        {/* <Slider value={context.me?.currentTime} max={context.me?.duration} aria-labelledby="continuous-slider" >
        <span id="buffered-amount"></span>
          </Slider> */}
          <div className='player-controls'>
        { context.bufferState === "loading" ?
          <CircularProgress />
        :
          <div>
          <button onClick={playAudio}>
          <span id="playbtn" className="material-icons">{context.audioState === "paused" ? "play_arrow" : "pause"}</span>
          </button>
          </div>
        }
        </div>
        
        
        
        
        
    </div>
    </div>



  

  );

  function playerMinimize(){
    document.getElementsByClassName('playerContainer')[0].style.transform = 'translateY(calc(100% - 106px))';
    dispatch({type: "setPlayerState", snippet: "min"})
  }
  

}






export default Player2;