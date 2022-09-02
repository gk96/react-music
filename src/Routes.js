import PlayerPage from "./pages/PlayerPage/PlayerPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import HomePage from "./pages/HomePage/HomePage";

export const routes = [
    {
      key: 'home',
      component: HomePage,
      path: '/home',
    },
    {
      key: 'search',
      component: SearchPage,
      path: '/',
    },
    {
      key: 'player',
      component: PlayerPage,
      path: '/player1/:videoId',
    },
  ];