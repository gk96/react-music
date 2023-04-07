import React from 'react';
import { AppContext } from '../../context/AppContext';
import {Link, useHistory} from 'react-router-dom';
import './HomePage.css';
import CardSlider from '../../components/CardSlider/CardSlider';
import { useEffect, useState, useContext} from 'react';
import {Skeleton} from '@material-ui/lab';
import {Box} from '@material-ui/core'
import PlayerService from '../../services/PlayerService';

function HomePage(props){

    const [context, dispatch] = useContext(AppContext);
    const history = useHistory();
    const [trendingItems, setTrendingItems] = useState();
    const [pickedItems, setPickedItems] = useState();

    useEffect(() => {
        console.log("home page effect")
        // console.log(context)
        if ((context?.trendingSongs == null ) && (context?.pickedSongs == null )){
        getSearchResult("trending songs").then(
            async (res) => {
                
                let response = await res.json()
                // console.log(response)
                
                let filteredResponse = response.filter(i => convertDurationToNumber(i?.duration_raw) <= 10 * 60)
                .map((val) => {
                    return {
                    imageUrl: val?.snippet?.thumbnails?.high?.url,
                    title: val?.title,
                    videoId: val?.id?.videoId
                    }
                });
                setTrendingItems(filteredResponse)
                
                dispatch({type: "setTrendingSongs", snippet: filteredResponse})
            })

        getSearchResult("malayalam trending songs").then(
            async (res) => {
                let response = await res.json()

                let filteredResponse = response.filter(i => convertDurationToNumber(i?.duration_raw) <= 10 * 60)
                .map((val) => {
                    return {
                    imageUrl: val?.snippet?.thumbnails?.high?.url,
                    title: val?.title,
                    videoId: val?.id?.videoId
                    }
                });
                
                setPickedItems(filteredResponse)
                dispatch({type: "setPickedSongs", snippet: filteredResponse})
            })
        }
        else{
            setTrendingItems(context.trendingSongs)
            setPickedItems(context.pickedSongs)
        }
    }, [])

    const convertDurationToNumber = (duration) => {
        let arr = duration?.split(":");
        let seconds = 0;
        switch(arr?.length){
            case 3:
                seconds = (parseInt(arr[0], 10) * 60 * 60) + (parseInt(arr[1], 10) * 60) + parseInt(arr[2], 10); break;
            case 2:
                seconds = (parseInt(arr[0], 10) * 60) + parseInt(arr[1], 10); break; 
            case 1:
                seconds = parseInt(arr[1], 10); break;
            default: break;
        }
        return seconds;
    }

    function getSearchResult(searchKey){
        return fetch(`${process.env.REACT_APP_API_BASE_URL}/api/ytdl/search`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            searchKey :searchKey
          }),
        });
    }

    function getHomePageHTML(){
        return {__html: "<h1>Hello World</h1>"}
    }

    function openPlayer(r){
        if (context.playerState == null | undefined){
            dispatch({type: "setPlayerState", snippet: "max"});
            setTimeout(() => history.push(`/player?songId=${r?.videoId}`), 150);
        }
        else if (context.playerState === "min" ){
            dispatch({type: "setPlayerState", snippet: "min"});
        }
        else if (context.playerState === "max" ){
            dispatch({type: "setPlayerState", snippet: "max"});
            setTimeout(() => history.push(`/player?songId=${r?.videoId}`), 150);
        }
    }

    function selectSong(e, r){
        e.preventDefault(); 
        context.me.removeAttribute('src');
        context.me.load();
        dispatch({type: "setBufferState", snippet: "loading"})
        dispatch({type: "setCurrentSong", snippet: {
            videoId: r?.videoId,
            trackTitle: r?.title,
            albumArtUrl: r?.imageUrl,
        }});

        setAudioSource(r?.videoId).then(() => {
            console.log("track loaded")
            dispatch({type: "setBufferState", snippet: "loaded"})
        })

        openPlayer(r)
    }

    async function setAudioSource(videoId){
        await PlayerService.setAudioSource(videoId, context); //Player 2
        // await PlayerService.setAudioUrl(videoId, context); //Player 3
    }

    const CardSkeleton = ({cardNumber}) => {
        return (
            <div style={{  display: 'flex',flexDirection: 'row' , justifyContent: 'space-evenly'}}>
                {
                     Array.from(
                        { length: cardNumber },
                        (_, i) => (
                            <Box key={i} sx={{ pt: 0.5 }} style={{width: '100%', height:'30vh', margin: '2.5%'}}>
                                <Skeleton variant="rect" style={{width: '100%', height:'20vh'}} />
                                <Skeleton />
                                <Skeleton />
                            </Box>
                        )
                    )
                }
                
            </div> 
        )
    }

    return(
        <div className="HomePage">
            <h3 >Welcome Back!</h3>
            {/* <div dangerouslySetInnerHTML={getHomePageHTML()} /> */}
            <h3 style={{'textAlign': 'left'}}>Trending Songs</h3>
            
            {trendingItems == null | undefined ? 
            <CardSkeleton cardNumber={2}/>
            :
            <CardSlider items={trendingItems} handleClick={selectSong} />
            }
            <h3 style={{'textAlign': 'left'}}>Picked for you</h3>
            {pickedItems == null | undefined ? 
            <CardSkeleton cardNumber={2}/>
            :
            <CardSlider items={pickedItems} handleClick={selectSong} />
            }
        </div>
        
    )
}

export default HomePage;