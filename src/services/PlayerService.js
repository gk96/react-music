const PlayerService = {
  setPlayButton: setPlayButton,
  getVideoInfo: getVideoInfo,
  getMIMEType: getMIMEType,
  setSource : onSourceOpen,
  setAudioSource: setAudioSource,
  setAudioUrl: setAudioUrl,
  setPlayerApperance: SetPlayerApperance
}

function setPlayButton(me, audioState){
  switch(audioState){
      case "paused":
        me.pause();
        break;
      case "playing":
        me.play();
        break;
      default:
        break;
  }
}

function SetPlayerApperance(e, playerState){
  switch(playerState){
    case "max":
      e.preventDefault()
      document.getElementsByClassName("mini-player")[0].style.height = 'calc(50%)'
      document.getElementsByClassName("mini-player")[0].style.transform = 'translateY(calc(-100%))'
      break;
    case "min":
      e.preventDefault();
      document.getElementsByClassName("playerContainer")[0].style.transform = 'translateY(calc(100%))';
      break;
    default:
      break;
  }
}

async function setAudioSource(videoId, context){
  context.me.src = `${process.env.REACT_APP_API_BASE_URL}/api/ytdl/download-video-ytdl-player2?videoUrl=https://www.youtube.com/watch?v=${videoId}`
  context.me.play()
}

async function setAudioUrl(videoId, context){
  var audioUrl = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/ytdl/download-video-ytdl-player3?videoId=${videoId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      videoId: videoId,
    }),
  })
  .then(res => res.text())
  
    console.log(audioUrl)
    context.me.src = audioUrl;
    context.me.play();
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