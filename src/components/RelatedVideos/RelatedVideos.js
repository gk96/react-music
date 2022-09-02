import React from 'react';
import { useEffect, useState, useContext} from 'react';
import './RelatedVideos.css';
import {Link} from 'react-router-dom'
import { AppContext } from '../../context/AppContext';
import { Accordion, CircularProgress } from '@material-ui/core';
import PlayerService from '../../services/PlayerService';

function RelatedVideos(props){

    const [relatedVideos, setRelatedVideos] = useState();
    const [toggleAccordian, setToggleAccordian] = useState(true);
    const [context, dispatch] = useContext(AppContext);
    const [loading, setLoading] = useState(false);


    useEffect(() => {

      if (context.relatedVideoSourceId !== context.currentSongDetails?.videoId){
        console.log("related videos effect")
        setLoading(true);
        getRelatedVideos(context.currentSongDetails?.videoId)
        .then(async (res) => {
            let videos = await res.json();
            dispatch({type: "setRelatedVideos", snippet: videos});
            dispatch({type: "setRelatedVideoSourceId", snippet: context.currentSongDetails?.videoId});
            setRelatedVideos([...videos]);
            setLoading(false);
        })
      }
      else{
        setRelatedVideos(context.relatedVideos);
      }
      
    }, [context.currentSongDetails?.videoId])

    function getRelatedVideos(videoId){
        return fetch(`${process.env.REACT_APP_API_BASE_URL}/api/ytdl/related-videos?videoId=${videoId}`, {
          //`http://192.168.0.103:3003/api/related-videos?videoId=${videoId}`, {
          headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
        });
    }

    function trackChange(r){
        console.log("track change cleanup")

    //   mediaSource.endOfStream()
      console.log(context.mediaSource?.sourceBuffers[0])
    //   mediaSource?.sourceBuffers[0].abort();
      try{
        context.mediaSource.removeSourceBuffer(context.store.mediaSource?.sourceBuffers[0]);
      console.log(context.mediaSource?.sourceBuffers[0])
      }

      catch(e){
        //   console.log(e)
      }

      dispatch({type: "setBufferState", snippet: "loading"})
      dispatch({type: "setCurrentSong", snippet: {
        videoId: r?.videoId,
        trackTitle: r?.title,
        albumArtUrl: r?.thumbnails.at(-1).url,
    }})

      if (document.getElementById("buffered-amount") != null || undefined)
        document.getElementById("buffered-amount").style.width = "0%";

      if(document.getElementById("progress-amount") != null || undefined)
        document.getElementById("progress-amount").style.width = "0px";

     if(document.getElementById("progress-scrub") != null || undefined)
        document.getElementById("progress-scrub").style.left = "0px";

      context.me.removeAttribute('src');
      context.me.load();

      
      setAudioSource(r?.videoId).then(() => {
        console.log("track loaded")
        dispatch({type: "setBufferState", snippet: "loaded"})
      })

      //setSource(context.currentSongDetails?.videoId);
      // setSource(r?.videoId).then(() => {
      //   console.log("track loaded")
      //   dispatch({type: "setBufferState", snippet: "loaded"})
      // })
    }

    async function setAudioSource(videoId){
      await PlayerService.setAudioSource(videoId, context);
  }
    async function setSource(videoId){
      await PlayerService.setSource(videoId, context);
  }

  function openRelatedVideos(e){
    e.preventDefault()
    setToggleAccordian(!toggleAccordian)
    if (toggleAccordian)
      document.getElementsByClassName("relatedVideosContainer")[0].style.height = '50vh'
    else
    document.getElementsByClassName("relatedVideosContainer")[0].style.height = '0vh'
    //     document.getElementsByClassName("relatedVideosContainer")[0].style.transform = 'translateY(calc(-100%))'
  }

    return(
        <div className="relatedVideos">
        <div className="accordian-header" onClick={(e) => openRelatedVideos(e)}>
          <p style={{"width": "200%"}}>Related Videos</p>
          <i className="material-icons">{toggleAccordian ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
          </div>
        
        <div className="relatedVideosContainer">{ 
          loading ? <CircularProgress /> :
            relatedVideos?.map((r) =>{
                // console.log(r?.snippet?.thumbnails)
                return(
                // <li key={r?.id?.videoId}>
                  <div className="related-list-item">
                    <Link className="related-list-item-detail" onClick={() => {trackChange(r)}} key={r?.videoId} to= 
                    {{
                        pathname :`/player1/${r?.videoId}`,
                        // state : {
                        //     albumArtUrl: r?.thumbnails[0].url,
                        //     videoId: r?.videoId,
                        //     title: r?.title
                        // }
                    }}>
                        {/* <div className="list-item"> */}
                    <img alt='' src={r?.thumbnails.at(-1).url}></img>
                    <div>
                    {r?.title}  
                    </div>
                        {/* </div> */}
                    </Link>
                  </div>
                );
            })
            }</div>
            </div>
    );

}

export default RelatedVideos;