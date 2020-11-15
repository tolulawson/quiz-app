import React from 'react';

const PlayerContext = React.createContext({
  player: null,
  setPlayer: () => {},
});

export default PlayerContext;
