import '../styles/globals.scss';
import createPersistedState from 'use-persisted-state';

const usePlayerInfoState = createPersistedState('playerInfo');

const usePlayerInfo = (info) => {
  const [playerInfo, setPlayerInfo] = usePlayerInfoState(info);

  return {
    playerInfo,
    setPlayerInfo,
  };
};

function MyApp({ Component, pageProps }) {
  const player = usePlayerInfo({});
  return (
    <Component {...pageProps} player={player} />
  );
}

export default MyApp;
