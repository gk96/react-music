import React from 'react';
import { useEffect, useState} from 'react';
import './Player.css';
import {useParams} from 'react-router-dom'
// import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Link} from 'react-router-dom'

  
  // var mediaSource = new MediaSource()
  // var me = document.createElement('audio');
  // // document.body.appendChild(me);
  // me.onerror = () => {console.log(me.error)}
  // me.src = URL.createObjectURL(mediaSource)
  // var mousedownFired = false

  
var me 
function Player(props) {
  const { videoId } = useParams()
    
    // console.log(props);
    // const [mediaSource, setMediaSource] = useState(new MediaSource());
    // const [me, setme] = useState(document.createElement('audio'))
    const [mousedownFired, setMouseDownFired] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [dm, setdm] = useState(0);
    const [ds, setds] = useState(0);
    const [cm, setcm] = useState(0);
    const [cs, setcs] = useState(0);
    const [relatedVideos, setRelatedVideos] = useState();
   
    useEffect(() => {
      setLoading(true)
      console.log('use effect')
      // mediaSource = new MediaSource()
      //me = document.createElement('audio');
      //me.src = URL.createObjectURL(mediaSource)

      me = document.getElementById('mediaSource')
      
      fetch('https://react-music-server.herokuapp.com/api/get-video-details', {
        //'http://192.168.0.103:3003/api/get-video-details', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // url : 'https://www.youtube.com/watch?v=7G7umMPwlO4',
        url: "https://www.youtube.com/watch?v=" + videoId,
      }),
    })
    .then(async (x) => {
      
      let res = await x.json()
      console.log(res)
      me.src = res.url
    })

    setNotificationLabel();

    getRelatedVideos(props.history.location.state.videoId)
  .then(async (res) => {
    let videos = await res.json();
    setRelatedVideos([...videos]);
  })

      // me.addEventListener('ended', () =>{
      //   console.log("ended")
      //   if(isPlaying){
      //     me.currentTime = 0;
      //   }
      //   document.getElementById('playbtn').innerHTML = 'play_arrow';
      // })

      me.addEventListener('loadedmetadata', loadedmetadata);
      
      me.addEventListener('progress',  progress);
    
      me.addEventListener('timeupdate', timeupdate);
  
      // mediaSource.addEventListener('sourceopen', sourceopen)

      // mediaSource.addEventListener('sourceclose', sourceclose)

      // Clean Up
    return () => {
      me.removeEventListener('loadedmetadata', loadedmetadata);
      me.removeEventListener('progress', progress);
      me.removeEventListener('timeupdate', timeupdate);
      // mediaSource.removeEventListener('sourceopen', sourceopen);


      if (isPlaying){
        me.pause();
        setIsPlaying(false)
      }

      me.removeAttribute('src'); // empty source
      me.load();
      //if(!sourceBuffer.updating){
        //me.currentTime = 0
        //sourceBuffer.remove(0, me.duration)
        //mediaSource.endOfStream()
         //mediaSource = new MediaSource()
        // mediaSource = new MediaSource()
        // sourceBuffer =
      //}
      
    }
   }, [videoId]);
  

   

   function setNotificationLabel(){

    if ('mediaSession' in navigator) {
      console.log("media session works")
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: props.history.location.state.title,
      artwork: [
        {
          src: props.history.location.state.albumArtUrl,
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    })
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
   }

   function progress(){
    console.log('add to buffer')
    var duration =  me.duration;
    if (me.duration > 0) {
      for (var i = 0; i < me.buffered.length; i++) {
            if (me.buffered.start(me.buffered.length - 1 - i) < me.currentTime) {
                document.getElementById("buffered-amount").style.width = (me.buffered.end(me.buffered.length - 1 - i) / duration) * 100 + "%";
                // me.play()
                // console.clear()
                console.log("Buffering =>" ,((me.buffered.end(me.buffered.length - 1 - i) / me.duration) * 100).toFixed(0) + "%")
                break;
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
      document.getElementById('progress-amount').style.width = ((me.currentTime / duration)*100) + "%";
      document.getElementById('progress-scrub').style.left = (me.currentTime / duration)*100 + "%";
    }
   }


    function moveThumb(e){
  
      e.preventDefault();
     if (mousedownFired) {
       setMouseDownFired(false);
       return;
     }
     console.log("click")
     me.pause()
     
     console.log(document.getElementById('progress-scrub').offsetWidth)
    
     // let shiftX = e.clientX - document.getElementById('progress-scrub').getBoundingClientRect().left;
     let newLeft = e.clientX - document.getElementById('seekBar').getBoundingClientRect().left;
    
           // the pointer is out of slider => lock the thumb within the bounaries
           if (newLeft < 0) {
             newLeft = 0;
           }
           let rightEdge = document.getElementById('seekBar').offsetWidth + document.getElementById('progress-scrub').offsetWidth;
           if (newLeft > rightEdge) {
             newLeft = rightEdge;
           }
    
           document.getElementById('progress-scrub').style.left = newLeft + 'px';
           document.getElementById('progress-amount').style.width = newLeft + 'px';
           console.log(me.duration)
           console.log((newLeft/document.getElementById('seekBar').clientWidth) *me.duration)
           
    
           me.currentTime = (newLeft/document.getElementById('seekBar').clientWidth) *me.duration;
           if(isPlaying){
             me.play()
           }
    }
     function onMouseDown(e){
       console.log("md")
       if (isPlaying){
         me.pause()
         // setIsPlaying(false)
       }
       // me.pause()
       // e.stopPropagation();
       e.preventDefault(); // prevent selection start (browser action)
       
         let shiftX = e.clientX - document.getElementById('progress-scrub').getBoundingClientRect().left;
         // shiftY not needed, the thumb moves only horizontally
    
         document.addEventListener('mousemove', onMouseMove);
         document.addEventListener('mouseup', onMouseUp);
    
         function onMouseMove(event) {
           let newLeft = event.clientX - shiftX - document.getElementById('seekBar').getBoundingClientRect().left;
    
           // the pointer is out of slider => lock the thumb within the bounaries
           if (newLeft < 0) {
             newLeft = 0;
           }
           let rightEdge = document.getElementById('seekBar').offsetWidth + document.getElementById('progress-scrub').offsetWidth;
           if (newLeft > rightEdge) {
             newLeft = rightEdge;
           }
    
           document.getElementById('progress-scrub').style.left = newLeft + 'px';
           document.getElementById('progress-amount').style.width = newLeft + 'px';
           console.log(document.getElementById('seekBar').offsetWidth)
           me.currentTime = (newLeft/document.getElementById('seekBar').offsetWidth) *me.duration;
         }
    
         function onMouseUp() {
           console.log("mup");
           setMouseDownFired(true);
           if(isPlaying){
             me.play();
           }
           
           document.removeEventListener('mouseup', onMouseUp);
           document.removeEventListener('mousemove', onMouseMove);
         }
       
     }
    
    
    
     function playAudio(e){
      e.preventDefault();
       // console.log(document.getElementById('playbtn').innerHTML);
       let span = document.getElementById('playbtn')
    
       if (isPlaying){
         setIsPlaying(false);
         me.pause();
         span.innerHTML = 'play_arrow'
       }
       else{
         setIsPlaying(true);
         me.play()
         span.innerHTML = 'pause'
       }
     }

    
  async function getRelatedVideos(videoId){
    return fetch(`https://react-music-server.herokuapp.com/api/related-videos?videoId=${videoId}`, {
      //`http://192.168.0.103:3003/api/related-videos?videoId=${videoId}`, {
      headers: {
        "Accept": "application/json",
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    })
  //   .then(async (r) => {

  //   let res = await r.json()
  //   console.log(res)
  // });
}
  
    
 

  return (
    <div>
      <audio id="mediaSource" autoPlay controls></audio>
    <div className="playerContainer">
      <button style={{ float: 'left'}}>
      <Link style={{ textDecoration: 'none'}} to="/" className="material-icons">arrow_back</Link>
      </button>
      
    <div className="bgImg" style={{backgroundImage: `url(${props.history.location.state.albumArtUrl})`}}>
    </div>
    <div className="Player">
        <div className="AlbumArt">
            <img alt='' src={props.history.location.state.albumArtUrl} />
        </div>
        <div>
        <h4> {props.history.location.state.title} </h4> 
        </div>
        
        {/* <div className="Seekbar"> */}
        {/* <audio controls crossOrigin="anonymous" id="audio">
          <source id="source">
          </source>
        </audio> */}
        {/* <LinearProgress variant="determinate" value={0} /> */}
        {/* <Slider value={me?.currentTime} max={me?.duration} aria-labelledby="continuous-slider" >
        <span id="buffered-amount"></span>
          </Slider> */}
        
        
        <div id="timeLine">
        <div>{loading ? "0:00" : cm.toString() + ":" +cs.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}</div>
        <div>{loading ? "0:00" : dm.toString() + ":" +ds.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}</div>
        </div>
        {/* </div> */}
        {/* <div className="seekBar"> */}
        
        {/* </div> */}
        <div id="seekBar" className="seekBar" onClick={moveThumb}>
            <span id="buffered-amount"></span>
            <div id="progress-amount"></div>
            <div onDragStart={() => false} onTouchStart={onMouseDown} onMouseDown={onMouseDown} id="progress-scrub"></div>
          {/* </div> */}
        </div>
        <div className="PlayerButtons">
        <button>
        <span className="material-icons">skip_previous</span>
        </button>
        <div>
        { loading ?
        <div>
          <CircularProgress />
          </div>
        :
          <div>
          <button onClick={playAudio}>
          <span id="playbtn"className="material-icons">play_arrow</span>
          </button>
          </div>
        }
        </div>
        
        <button>
        <span className="material-icons">skip_next</span>
        </button>
        
        </div>
        
    </div>
    </div>

<div>{ 
  relatedVideos?.map((r) =>{
      // console.log(r?.snippet?.thumbnails)
      return(
      // <li key={r?.id?.videoId}>
          <Link key={r?.videoId} to= 
          {{
              pathname :`/player/${r?.videoId}`,
              state : {
                  albumArtUrl: r?.thumbnails[0].url,
                  videoId: r?.videoId,
                  title: r?.title
              }
          }}>
              <div className="list-item">
                  <img alt='' src={r?.thumbnails[0].url}></img>
                  <div>
                  {r?.title}  
                  </div>
              </div>
          </Link>
      );
  })
  }</div>

  </div>

  );

  


}






export default Player;