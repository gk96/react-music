import PlayerPage from "./pages/PlayerPage/PlayerPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import HomePage from "./pages/HomePage/HomePage";
import PlaylistPage from "./pages/PlaylistPage/PlaylistPage";
import PlaylistItemsPage from "./pages/PlaylistPage/PlaylistItems/PlaylistItemsPage"

export const routes = [
    {
      key: 'home',
      component: HomePage,
      path: '/',
    },
    {
      key: 'search',
      component: SearchPage,
      path: '/search',
    },
    {
      key: 'playlists',
      component: PlaylistPage,
      path: '/playlists',
    },
    {
      key: 'playlist',
      component: PlaylistItemsPage,
      path: '/playlist',
      parms: 'playlistId'
    },
    {
      key: 'player',
      component: PlayerPage,
      path: '/player',
      params: 'songId'
    },
  ];