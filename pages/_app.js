import React from 'react';
import '../styles/globals.scss';
import createPersistedState from 'use-persisted-state';
import PlayerContext from '../js/playerContext';

const useRepState = createPersistedState('rep');

const useRep = (repName) => {
  const [rep, setRep] = useRepState(repName);
  return {
    rep,
    setRep,
  };
};

function MyApp({ Component, pageProps }) {
  const rep = useRep('');
  const [player, setPlayerInfo] = React.useState({});
  const setPlayer = ((playerInfo) => setPlayerInfo(playerInfo));

  return (
    <PlayerContext.Provider value={{ player, setPlayer }}>
      <Component {...pageProps} rep={rep} />
    </PlayerContext.Provider>
  );
}

export default MyApp;
