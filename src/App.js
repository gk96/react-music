import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import { Switch, Route, BrowserRouter} from "react-router-dom";
import { useLocation } from "react-router-dom";
// import SuggestPage from './pages/SuggestPage/SuggestPage';
import MiniPlayer from './components/MiniPlayer/MiniPlayer';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import { AppContext } from './context/AppContext';
import { routes } from './Routes';
import { Snackbar } from '@material-ui/core';

function App() {
  const [context, dispatch] = useContext(AppContext)
  const [networkStatus, setNetworkStatus] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // console.log(window.location.pathname)
    // console.log(JSON.parse(window.localStorage.getItem('store')));
    // var store = JSON.parse(window.localStorage.getItem('store'))
    // if (JSON.parse(window.localStorage.getItem('store')) != null || undefined)
      // dispatch({type: "setLocalStore" , snippet: JSON.parse(window.localStorage.getItem('store'))});
    console.log('Environment ->', process.env.NODE_ENV);
    console.log('Api base url ->', process.env.REACT_APP_API_BASE_URL);
    console.log('Stream base url ->', process.env.REACT_APP_MUSIC_STREAM_URL);

    window.addEventListener("online", () => {setNetworkStatus(navigator.onLine)});
    window.addEventListener("offline", () => {setNetworkStatus(navigator.onLine)});
    

    return () => {
      console.log("unmount")
      window.removeEventListener("online", () => {setNetworkStatus(navigator.onLine)});
      window.removeEventListener("offline", () => {setNetworkStatus(navigator.onLine)});
    }
 }, []);

 useEffect(() => {
  window.localStorage.setItem('store', JSON.stringify(context?.localStore));
 }, [context?.localStore])

//   useEffect(() => {
    
//  },[context]);

//  function setNotificationLabel(){

//   if ('mediaSession' in navigator) {
//     console.log("media session works")
//   navigator.mediaSession.metadata = new window.MediaMetadata({
//     title: context.currentSongDetails.trackTitle,
//     artwork: [
//       {
//         src: context.currentSongDetails.albumArtUrl == null || undefined ? '' : context.currentSongDetails.albumArtUrl,
//         sizes: '512x512',
//         type: 'image/png',
//       },
//     ],
//   })
// }
// }

 
  return (
    
    <div className="appContainer">
        {/* <Header /> */}
        { !location.pathname.includes("player") ? <Header /> : null}
        <div className="appBody">
          <Switch>
          {routes.map(props => <Route exact {...props} />)} 
          </Switch>
        </div>

        <div className='bottomContainer'>
          {context.playerState === "min" ? <MiniPlayer /> : null}
          
          { !location.pathname.includes("player") ? <Footer /> : null}
        </div>

        <Snackbar 
        style={{'zIndex': 10000}}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        message="No internet Connection"
        autoHideDuration={5000}
        open={!networkStatus}
        />

    </div>
    // </BrowserRouter>
  );
}

export default App;
