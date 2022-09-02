import React, { useReducer } from 'react';
import PlayerService from '../services/PlayerService';

export const AppContext = React.createContext(null);

var store = {
    me: document.createElement('audio'),
    mediaSource: new MediaSource(),
    sourceBuffer: null,
    searchResult: null,
    relatedVideos: null,
    menuOpen: false,
    snackbarMsg: false,
    themeSelectValue: "Default",
    currentSongDetails: {},
    testProp: {},
    audioState: "paused",
    bufferState: "loading",
    playerState: null,
    relatedVideoSourceId: ""
}

const reducer = (state, action) => {
    switch (action.type){
        case "setCurrentSong":
            return{
                ...state,
                currentSongDetails: action.snippet
            };
        
        case "setRelatedVideos": 
            return {
                ...state,
                relatedVideos: action.snippet
            };
        
        case "setThemeSelectValue":
            return {
                ...state,
                themeSelectValue: action.snippet
            };
        case "setAudioState":
            PlayerService.setPlayButton(store.me, action.snippet);
            return {
                ...state,
                audioState: action.snippet
            };
        case "setBufferState":
            return {
                ...state,
                bufferState: action.snippet
            };
        case "setPlayerState":
            return {
                ...state,
                playerState: action.snippet
            }

        case "setRelatedVideoSourceId":
            return {
                ...state,
                relatedVideoSourceId: action.snippet
            }
        case "setSearchResult":
            return{
                ...state,
                searchResult: action.snippet
            }
            
        case "setStore":
            return action.snippet;
        
        default:
            return state;
    }
}

export const ContextWrapper = (props) => {
	
	// const [ actions, setActions ] = useState({
	// 	addSource: mimeType => setStore({ ...store, sourceBuffer: store.mediaSource.addSourceBuffer(mimeType) }),

    //     addTrackDetails: details => setStore({ ...store, trackDetails: details}),

    //     addTestprop: prop => setStore({ ...store, testProp: prop})

	// });
	
    const globalStore = useReducer(reducer, store);

	return (
		<AppContext.Provider value={ globalStore }>
			{props.children}
		</AppContext.Provider>
	);
}