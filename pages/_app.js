/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import '../styles/globals.scss';
import PlayerContext from '../js/playerContext';

function MyApp({ Component, pageProps }) {
  const [player, setPlayer] = React.useState({
    name: null,
    id: null,
  });

  return (
    <PlayerContext.Provider value={{ player, setPlayer }}>
      <Component {...pageProps} />
    </PlayerContext.Provider>
  );
}

export default MyApp;
