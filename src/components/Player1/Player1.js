import React from 'react';
import { useEffect, useState, useContext} from 'react';
import './Player1.css';
import {useParams, useHistory} from 'react-router-dom'
// import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Link} from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import PlayerService from '../../services/PlayerService';

  
  // var mediaSource = new MediaSource()
  // var me = document.createElement('audio');
  // // document.body.appendChild(me);
  // me.onerror = () => {console.log(me.error)}
  // me.src = URL.createObjectURL(mediaSource)
  // var mousedownFired = false

  
// var me
// var mediaSource
// var reader;
// var ad//, sourceBuffer
  
 
function Player1() {
  const { videoId } = useParams();
  const history = useHistory();
  //var me = document.createElement('audio');
  //var mediaSource
    // console.log(props);
    const [context, dispatch] = useContext(AppContext)
    var me = context.me;
    const mediaSource = context.mediaSource;
    // const [mediaSource, setMediaSource] = useState(new MediaSource());
    //  const [me, setme] = useState(document.createElement('audio'))
    const [mousedownFired, setMouseDownFired] = useState(false);
    const [loading, setLoading] = useState(false);
    // const [isPlaying, setIsPlaying] = useState(false);
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

        PlayerService.setSource(videoId, context).then(() => {
          dispatch({type: "setBufferState", snippet: "loaded"})
        });

        });

      }
    //   mediaSource = new MediaSource()
    //   me = document.createElement('audio');
      // me.src = URL.createObjectURL(mediaSource)

    //   me = document.getElementById('mediaSource')
      
    //   fetch('https://react-music-server.herokuapp.com/api/get-video-details', {
    //     //'http://192.168.0.103:3003/api/get-video-details', {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     // url : 'https://www.youtube.com/watch?v=7G7umMPwlO4',
    //     url: "https://www.youtube.com/watch?v=" + videoId,
    //   }),
    // })
    // .then(async (x) => {
      
    //   let res = await x.json()
    //   console.log(res)
    //   me.src = res.url
    // })
    
     setNotificationLabel();
   

//     getRelatedVideos(props.history.location.state.videoId)
//   .then(async (res) => {
//     let videos = await res.json();
//     setRelatedVideos([...videos]);
//   })

      // me.addEventListener('ended', () =>{
      //   console.log("ended")
      //   if(isPlaying){
      //     me.currentTime = 0;
      //   }
      //   document.getElementById('playbtn').innerHTML = 'play_arrow';
      // })

      me?.addEventListener('loadedmetadata', loadedmetadata);
      
      me?.addEventListener('progress',  progress);
    
      me?.addEventListener('timeupdate', timeupdate);

      // mediaSource.addEventListener('sourceopen', sourceopen)

      mediaSource?.addEventListener('sourceclose', sourceclose)

      dispatch({type: "setPlayerState", snippet: "max"})

      // Clean Up
    return () => {
      dispatch({type: "setPlayerState", snippet: "min"})
      // me.removeEventListener('loadedmetadata', loadedmetadata);
      me?.removeEventListener('progress', progress);
      me?.removeEventListener('timeupdate', timeupdate);
      // mediaSource.removeEventListener('sourceopen', sourceopen);

    //   console.log(mediaSource.sourceBuffers[0])
    //   mediaSource.removeSourceBuffer(mediaSource.sourceBuffers[0]);
    //   console.log(mediaSource.sourceBuffers[0])
    //   if (isPlaying){
    //     me.pause();
    //     setIsPlaying(false)
    //   }

      
    //   me.removeAttribute('src'); // empty source
      //me.load();
      //if(!sourceBuffer.updating){
        //me.currentTime = 0
        //sourceBuffer.remove(0, me.duration)
        //mediaSource.endOfStream()
         //mediaSource = new MediaSource()
        // mediaSource = new MediaSource()
        // sourceBuffer =
      //}

    //   trackChange();
      
    }
   }, [context.currentSongDetails]);
  

   
   function sourceclose(){
     console.log("source close")
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
                document.getElementById("buffered-amount").style.width = (me.buffered.end(me.buffered.length - 1 - i) / duration) * 100 + "%";
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
      document.getElementById('progress-amount').style.width = ((me.currentTime / duration)*100) + "%";
      document.getElementById('progress-scrub').style.left = (me.currentTime / duration)*100 + "%";
    }
   }

//    async function sourceopen(){
       
//     let res = await getVideoInfo(videoId)
//     console.log(res)

//     //console.log("sourceopen")
//     fetch('https://react-music-server.herokuapp.com/api/download-video', {
//       //'http://192.168.0.103:3003/api/download-video', {
//     method: 'POST',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       videoUrl:  res.url,
//     }),
//   })
//   .then(async (response) => {
//     let reader = response.body.getReader();
//     let chunks = [];
//     let sourceBuffer = mediaSource.addSourceBuffer(getMIMEType(res.ext, res.acodec))
//     // let sourceBuffer = mediaSource.addSourceBuffer('audio/webm;codecs=opus')
//     let result;
//     sourceBuffer.mode = 'sequence';

//     while(!result?.done) {
//     //   const {done, value} = await reader.read();
//       result = await reader.read();
//       // If it's done, there will be no value

//       chunks.push(result?.value?.buffer);
//       if((sourceBuffer != null || undefined) && chunks.length > 0 && !sourceBuffer.updating && (chunks[0] != null || undefined)){

//             if (mediaSource?.sourceBuffers[0] != null || undefined){
//                 try{
//                     sourceBuffer?.appendBuffer(chunks.shift())
//                 }
//                 catch(e){
//                     // console.log(e)
//                 }
                
//             }
//         // }
//         setLoading(false)
         
//       }

//       if (result?.done) {

//         console.log("Fetch Data Complete..")
//         sourceBuffer.addEventListener('updateend', function (){
//           if (!sourceBuffer.updating && mediaSource.readyState === 'open') {  
//             if(chunks.length > 0 && !sourceBuffer.updating && (chunks[0] != null || undefined)){
//               console.log("Remaining chunks =>", chunks.length)
//               console.log(chunks)
//               console.log(sourceBuffer.updating)
//               if (sourceBuffer != undefined){
//               sourceBuffer.appendBuffer(chunks.shift())
//               }
//           }
//           else if (sourceBuffer != null && ((chunks[0] == null || undefined) || chunks.length <=0) && !sourceBuffer.updating){
//             console.log("stream end")
//             mediaSource.endOfStream(); 
//           }        
//           }
//         })
//         break;
//       }
//     }
//     return chunks
//  })
// }

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
           if(context.audioState === "playing"){
             me.play()
           }
    }

     
    function onMouseDown(e){
       console.log("md")
       if (context.audioState === "playing"){
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
           if(context.audioState === "playing"){
             me.play();
           }
           
           document.removeEventListener('mouseup', onMouseUp);
           document.removeEventListener('mousemove', onMouseMove);
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

    
//   function getRelatedVideos(videoId){
//     return fetch(`https://react-music-server.herokuapp.com/api/related-videos?videoId=${videoId}`, {
//       //`http://192.168.0.103:3003/api/related-videos?videoId=${videoId}`, {
//       headers: {
//         "Accept": "application/json",
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': '*'
//       },
//     });
// }

async function getVideoInfo(videoId){
    
    let response = await fetch('https://react-music-server.herokuapp.com/api/get-video-details', {
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
    });

    return await response.json()
}
  
    function minimizePlayer(){
      document.getElementsByClassName("playerContainer")[0].style.transform = 'translateY(calc(100% - 106px))';
    }
 

  return (
    <div>
      {/* <audio id="mediaSource" autoPlay controls></audio> */}
    <div className="playerContainer">
      {/* <button style={{ float: 'left'}} >
      <Link onClick={minimizePlayer} style={{ textDecoration: 'none'}} to="/" className="material-icons">arrow_back</Link>
      </button> */}
      
    <div className="bgImg" style={{backgroundImage: `url(${context?.currentSongDetails?.albumArtUrl})`}}>
    </div>
    <div className="Player">
        <div className="AlbumArt">
            <img src={context?.currentSongDetails?.albumArtUrl} />
        </div>
        <div>
        <h4> {context?.currentSongDetails?.trackTitle} </h4> 
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
        
        {/* <div>{context?.bufferState === "loading" ? "0:00" : parseInt((me?.currentTime / 60) % 60).toString() + ":" +parseInt(me?.currentTime % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}</div> */}
        {/* <div>{context?.bufferState === "loading" ? "0:00" : parseInt((me?.duration / 60) % 60).toString() + ":" +parseInt(me?.duration % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}</div> */}
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
        { context.bufferState === "loading" ?
        <div>
          <CircularProgress />
          </div>
        :
          <div>
          <button onClick={playAudio}>
          <span id="playbtn" className="material-icons">{context.audioState === "paused" ? "play_arrow" : "pause"}</span>
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



  </div>

  );

  function playerMinimize(){
    document.getElementsByClassName('playerContainer')[0].style.transform = 'translateY(calc(100% - 106px))';
    dispatch({type: "setPlayerState", snippet: "min"})
  }
  function trackChange(){
      console.log("track change cleanup")

    //   mediaSource.endOfStream()
      console.log(mediaSource?.sourceBuffers[0])
    //   mediaSource?.sourceBuffers[0].abort();
      try{
        mediaSource.removeSourceBuffer(mediaSource?.sourceBuffers[0]);
      console.log(mediaSource?.sourceBuffers[0])
      }

      catch(e){
        //   console.log(e)
      }
      
      
      if (document.getElementById("buffered-amount") != null || undefined)
        document.getElementById("buffered-amount").style.width = "0%";

      if(document.getElementById("progress-amount") != null || undefined)
        document.getElementById("progress-amount").style.width = "0px";

     if(document.getElementById("progress-scrub") != null || undefined)
        document.getElementById("progress-scrub").style.left = "0px";

      // setcm(0);setdm(0);setcs(0);setds(0);

    //   if (isPlaying){
    //     me.pause();
    //     me.currentTime = 0;
    //     setIsPlaying(false)
    //   }

      
      me.removeAttribute('src');
      me.load();
      
    //   console.log("done?", reader?.done)
    //   reader.cancel();
  }

 function getMIMEType(extension, codecs){
   switch(extension){
     case 'webm' : return `audio/${extension};codecs=${codecs}`;
     case 'm4a' : return `audio/mp4;codecs=${codecs}`;
     default : return `audio/webm;codecs=opus`;
   }
 }
  
  function getAudioFile(){
    return fetch('http://192.168.0.104:3003/api/download-video', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url : 'https://www.youtube.com/watch?v=B2DGTD1Heg4'
      }),
    })
    .then(async (response) => {
      let reader = response.body.getReader();
      let chunks = [];
      const mediaSource = new MediaSource()
      var me = document.createElement('audio');
      document.body.appendChild(me);
      me.src = URL.createObjectURL(mediaSource)
      // const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg')
      // me.src = URL.createObjectURL(mediaSource)
      // sourceBuffer.appendBuffer(chunk) // Repeat this for each chunk as ArrayBuffer
      
      // var context = new AudioContext()
      // var me = document.createElement('audio');
      
      // var options = {
      //   mediaElement : me
      // }
      
      // var myAudioSource = new MediaElementAudioSourceNode(context, options);
      
      
      // source.connect(context.destination)
      while (true) {
        await reader.read()
        const { done, value } = await reader.read()
    
        if (done) {
            break
        }
        // let myAudioSource = context.createMediaStreamSource(value.buffer)
        // myAudioSource.connect(context.destination);
        // console.log(myAudioSource)
        mediaSource.addEventListener('sourceopen', ()=>{
          const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg')
          console.log(value.buffer)
          sourceBuffer.appendBuffer(value.buffer)
          chunks.push(value.buffer)
          me.play()
        })
        
        // me.muted = true;
        // me.autoplay = true;
        // me.play();
      
        // const buffer = await context.decodeAudioData(value.buffer)
        // source.buffer = buffer
        // source.start()
    }
      return chunks
    })
  }


}






export default Player1;