import React, { useContext } from 'react';
import { useEffect, useState, useCallback} from 'react';
import './SearchPage.css';
import {Link, useHistory} from 'react-router-dom'
import _ from 'lodash'
import { AppContext } from '../../context/AppContext';
import PlayerService from '../../services/PlayerService';
import { CircularProgress } from '@material-ui/core';

function SearchPage(){

    
    const [searchItems, setSearchItems] = useState();
    const [input, setInput] = useState();
    const [searchLoader, setSearchLoader] = useState(false);
    const [searchKey, setSearchKey] = useState("");
    const [context, dispatch] = useContext(AppContext)
    const history = useHistory();
    // const inputRef = useRef();
    // const [suggestItems, setSuggestItems] = useState();

    useEffect(() =>{
        console.log("mount search")
        console.log(context.searchKey)
        if(context?.searchResult?.length > 0 && context?.searchResult !== undefined | null){
            setSearchItems(context.searchResult)
        }
        setSearchKey(context.searchKey)

        return () => {
            console.log("unmount search")
            console.log(searchItems)
            console.log(searchKey)
            dispatch({type: "setSearchKeyValue", snippet: searchKey});
            dispatch({type: "setSearchResult", snippet: searchItems});
        }
    }, [context?.searchKey])

    const debouncedChangeHandler = useCallback( _.debounce(searchSong, 400)  , []);
    
    return (
        <div>
            <h3>Search</h3>
            <input type="text" placeholder="Type Song Name, Lyrics, Movie/Album/Singer Name" onChange={debouncedChangeHandler}/>
            
            {/* <ul>{ 
            suggestItems?.map((r) =>{
                return <li key={r?.id?.videoId}>{r?.title}</li>
            })
            }</ul> */}
            <div className='search-result-container'>{ searchLoader ? <div style={{paddingTop: '50%' }}><CircularProgress /></div> :
            searchItems?.map((r) =>{
                // console.log(r?.snippet?.thumbnails)
                return(
                // <li key={r?.id?.videoId}>
                <div className="list-item">
                    <Link className='list-item-link' onClick={ (e) => {selectSong(e, r)} } key={r?.id?.videoId} to={`/player?songId=${r?.id?.videoId}`}>
                        <img alt='' src={r?.snippet?.thumbnails?.default?.url} />
                        <div>
                            {r?.title}  
                         </div>
                    </Link>
                </div>
                );
                // return <li onClick={playSong} key={r?.id?.videoId}>{r?.title}</li>
            })
            }</div>
            {/* {
                searchItems == null || undefined ? null : <Player videoId={searchItems[0]?.id?.videoId} />
            } */}
            
        </div>
    );

// function playSong(event)
// {
//     console.log(event.target)
// }

function openPlayer(r){
    if (context.playerState == null | undefined){
        dispatch({type: "setPlayerState", snippet: "max"});
        dispatch({type: "setSearchResult", snippet: searchItems});
        setTimeout(() => history.push(`/player?songId=${r?.id?.videoId}`), 150);
    }
    else if (context.playerState === "min" ){
        dispatch({type: "setSearchResult", snippet: searchItems});
        dispatch({type: "setPlayerState", snippet: "min"});
    }
    else if (context.playerState === "max" ){
        dispatch({type: "setPlayerState", snippet: "max"});
        dispatch({type: "setSearchResult", snippet: searchItems});
        setTimeout(() => history.push(`/player?songId=${r?.id?.videoId}`), 150);
    }
}


async function selectSong(e, r){
    e.preventDefault(); 
    context.me.removeAttribute('src');
    context.me.load();
    dispatch({type: "setBufferState", snippet: "loading"})
    dispatch({type: "setCurrentSong", snippet: {
        videoId: r?.id?.videoId,
        trackTitle: r?.title,
        albumArtUrl: r?.snippet?.thumbnails?.default?.url,
    }});

    // dispatch({type: "setBufferState", snippet: "loading"})

    // setSource(r?.id?.videoId).then(() => {
    //     console.log("track loaded")
    //     dispatch({type: "setBufferState", snippet: "loaded"})
    // })

    setAudioSource(r?.id?.videoId).then(() => {
        console.log("track loaded")
        // dispatch({type: "setBufferState", snippet: "loaded"})
    })

    openPlayer(r)
    //await setSource(r?.id?.videoId);
    
}

// async function setSource(videoId){
//     await PlayerService.setSource(videoId, context);
// }

async function setAudioSource(videoId){
    await PlayerService.setAudio(videoId, context);
    // await PlayerService.setAudioSource(videoId, context); //Player 2
    // await PlayerService.setAudioUrl(videoId, context); //Player 3
}

function suggestSearch(event){
    setSearchKey(event?.target?.value)
    setSearchLoader(true);
    console.log(event?.target?.value)

}
function searchSong(event){
    setSearchKey(event?.target?.value)
    setSearchLoader(true);
    console.log(event?.target?.value)
    setInput(event?.target?.value)
    // inputRef.current(event?.target?.value)
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/ytdl/search`, {
        //'http://192.168.0.103:3003/api/search', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        searchKey : event?.target?.value
      }),
    })
    .then(
        async (res) => {
            let response = await res.json()
            console.log(response[0]?.id?.videoId)
            setSearchItems([...response])
            setSearchLoader(false)
        }
    )
}
}

export default SearchPage;