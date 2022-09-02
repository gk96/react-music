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

function App() {

  const [context, dispatch] = useContext(AppContext)
  const location = useLocation();

  useEffect(() => {
    // console.log(window.location.pathname)
    console.log(JSON.parse(window.localStorage.getItem('store')));
    // dispatch({type: "setStore", snippet: JSON.parse(window.localStorage.getItem('store'))})
    console.log('Environment ->', process.env.NODE_ENV);
    console.log('Api base url ->', process.env.REACT_APP_API_BASE_URL);
 }, []);

  useEffect(() => {
    return () => {
      console.log("unmount")
      window.localStorage.setItem('store', JSON.stringify(context));
    }
 },[]);

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
        {/* { !location.pathname.includes("player1") ? <Header /> : null} */}
        <div className="appBody">
        <Switch>
        {routes.map(props => <Route exact {...props} />)} 
        </Switch>
      
        </div>
        {context.playerState === "min" ? <MiniPlayer /> : null}
        { !location.pathname.includes("player1") ? <Footer /> : null}
    </div>
    // </BrowserRouter>
  );
}

export default App;
