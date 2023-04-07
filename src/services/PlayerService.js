
const PlayerService = {
  setPlayButton: setPlayButton,
  getVideoInfo: getVideoInfo,
  getMIMEType: getMIMEType,
  setSource : onSourceOpen,
  setAudioSource: setAudioSource,
  setAudioUrl: setAudioUrl,
  setPlayerApperance: SetPlayerApperance,
  setNotificationLabel: setNotificationLabel,
  setAudio: setAudio
}

function setPlayButton(me, audioState){
  switch(audioState){
      case "paused":
        me.pause();
        break;
      case "playing":
        me.play()
        .then(() =>{
          me.muted = false;
          // setNotificationLabel()
        }).catch((error) => {
          // Auto-play was prevented
          // Show paused UI.
          // console.log("playback prevented");
        });
        break;
      default:
        break;
  }
}

function setAudioState(ctx, audioState){
  switch(audioState){
      case "paused":
        ctx.audioState = "paused"
        break;
      case "playing":
        ctx.audioState = "playing"
        break;
      case "error":
        console.log("setting error flag")
        ctx.audioState = "error"
        break;
      default:
        break;
  }
}

function SetPlayerApperance(e, playerState){
  switch(playerState){
    case "max":
      e.preventDefault()
      document.getElementsByClassName("mini-player")[0].style.height = 'calc(500%)'
      document.getElementsByClassName("mini-player")[0].style.transform = 'translateY(calc(-300%))'
      break;
    case "min":
      e.preventDefault();
      document.getElementsByClassName("playerContainer")[0].style.transform = 'translateY(calc(100%))';
      break;
    default:
      break;
  }
}

function setNotificationLabel(currentSongDetails){
  if ('mediaSession' in navigator) {
    console.log("media session works")
  navigator.mediaSession.metadata = new window.MediaMetadata({
    title: currentSongDetails.trackTitle,
    artwork: [
      {
        src: currentSongDetails.albumArtUrl == null || undefined ? '' : currentSongDetails.albumArtUrl,
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  })

  // navigator.mediaSession.setActionHandler('play', function() { dispatch({type: "setAudioState", snippet: "playing"}) });
  // navigator.mediaSession.setActionHandler('pause', function() { dispatch({type: "setAudioState", snippet: "paused"}) });
}
}

async function setAudio(videoId, context, player = "2"){
  switch(player){
    case "1":
      return onSourceOpen(videoId, context);
    case "2":
      return setAudioSource(videoId, context);
    case "3":
      return setAudioUrl(videoId, context);
    default:
      return setAudioUrl(videoId, context)
  }

}
async function setAudioSource(videoId, context){
   let url = `${process.env.REACT_APP_MUSIC_STREAM_URL}/download-video-ytdl-player2?videoUrl=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`
  // context.me.src = `${process.env.REACT_APP_API_BASE_URL}/api/ytdl/download-video-ytdl-player2?videoUrl=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`
  // context.me.autoplay=true;
  // context.me.controls = false;
  context.me.setAttribute('crossorigin', '');
  // document.body.appendChild(context.me);
  // context.me.crossOrigin = "anonymous";
  // var audio = new Audio(url)
  
  context.me.src = url;
  // audio.crossOrigin = "anonymous"
  context.me.muted = true;
  console.log(context.me)

  // audio.play()
  // console.log(audio)
  // context.me.muted = false;
                // context.me.play();
  // context.me.autoplay = true;
}

async function setAudioUrl(videoId, context){

  // let info = await ytdl.getInfo(videoId);
  // console.log(info)
  // let format = ytdl.chooseFormat(info.formats, { quality: 'lowestaudio' });
  // console.log('Format found!', format);

  // console.log(format?.url)
  // context.me.src = format?.url;
  // // context.me.autoplay = true;
  // context.me.play()


   await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/ytdl/download-video-ytdl-player3?videoId=${videoId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      videoId: videoId,
    }),
  })
  .then(res => {
    return res.text().then(audioUrl => {
        console.log(audioUrl)
        context.me.src = audioUrl;
      })
      
      // return audioUrl;
      // context.me.autoplay = true;
      //context.me.play()
    
  })
}

async function getVideoInfo(videoId){
    
  let response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/ytdl/search-by-id`, {
    //'http://192.168.0.103:3003/api/get-video-details', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      // url : 'https://www.youtube.com/watch?v=7G7umMPwlO4',
      videoId: videoId,
    }),
  });

  return await response.json()
}

function getMIMEType(extension, codecs){
  switch(extension){
    case 'webm' : return `audio/${extension};codecs=${codecs}`;
    case 'm4a' : return `audio/mp4;codecs=${codecs}`;
    default : return `audio/webm;codecs=opus`;
  }
}

async function onSourceOpen(videoId, context){
  context.me.src = URL.createObjectURL(context?.mediaSource)
  let res = await getVideoInfo(videoId)
  console.log(res)

  //console.log("sourceopen")
  fetch(`${process.env.REACT_APP_API_BASE_URL}/api/ytdl/download-video-ytdl-player1`, {
    // 'http://192.168.0.103:3003/api/download-video-parts', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    // videoUrl:  res.url,
    videoUrl: "https://www.youtube.com/watch?v=" + videoId
  }),
})
.then(async (response) => {
  let reader = response.body.getReader();
  let chunks = [];
  let sourceBuffer = context.mediaSource.addSourceBuffer(this.getMIMEType(res.ext, res.acodec))
  // let sourceBuffer = mediaSource.addSourceBuffer('audio/webm;codecs=opus')
  let result;
  sourceBuffer.mode = 'sequence';

  while(!result?.done) {
  //   const {done, value} = await reader.read();
    result = await reader.read();
    // If it's done, there will be no value

    chunks.push(result?.value?.buffer);
    if((sourceBuffer != null || undefined) && chunks.length > 0 && !sourceBuffer.updating && (chunks[0] != null || undefined)){

          if (context.mediaSource?.sourceBuffers[0] != null || undefined){
              try{
                  sourceBuffer?.appendBuffer(chunks.shift())
              }
              catch(e){
                  // console.log(e)
              }
              
          }
      // }
      // setLoading(false)
    //   dispatch({type: "setAudioState", snippet: {
    //     audioState: "loaded"
    // }});
       
    }

    if (result?.done) {

      console.log("Fetch Data Complete..")
      sourceBuffer.addEventListener('updateend', function (){
        if (!sourceBuffer.updating && context.mediaSource.readyState === 'open') {  
          if(chunks.length > 0 && !sourceBuffer.updating && (chunks[0] != null || undefined)){
            console.log("Remaining chunks =>", chunks.length)
            console.log(chunks)
            console.log(sourceBuffer.updating)
            if (sourceBuffer !== undefined){
            sourceBuffer.appendBuffer(chunks.shift())
            }
        }
        else if (sourceBuffer != null && ((chunks[0] == null || undefined) || chunks.length <=0) && !sourceBuffer.updating){
          console.log("stream end")
          context.mediaSource.endOfStream(); 
        }        
        }
      })
      break;
    }
  }
  return chunks
})
}







export default PlayerService