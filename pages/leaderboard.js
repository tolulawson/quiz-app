/* eslint-disable no-nested-ternary */
import React from 'react';
import PlayerContext from '../js/playerContext';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = React.useState(null);
  const { player } = React.useContext(PlayerContext);

  React.useEffect(() => {
    fetch(`api/leaderboard?id=${player.id ? player.id : ''}`)
      .then((res) => res.json())
      .then((data) => {
        setLeaderboardData(data.games);
      });
  }, []);

  return (
    <div className='leaderboard-page'>
      <div className='header'>
        <img src='/img/leaderboard.svg' alt='Leaderboard icon' />
        <h1>Leaderboard</h1>
      </div>
      {
        !leaderboardData
          ? <img src='/img/loaders.svg' className='spinner' alt='Spinner' />
          : leaderboardData.length < 1
            ? <p className='no-records'>It&apos;s lonely out here</p>
            : (
              <div className='leaderboard-table'>
                {
                  leaderboardData.map((record) => (
                    <div className={record.id === player.id ? 'leaderboard-row new' : 'leaderboard-row'} key={record.id}>
                      <span className='serial'>{`${record.rank}.`}</span>
                      <span className='name'>{record.name}</span>
                      <span className='points'>{`${record.score} %`}</span>
                      <span className='time'>{`${record.timeTaken}s`}</span>
                    </div>
                  ))
                }
              </div>
            )
      }
      <a href='/'>
        <img src='/img/home.svg' alt='home button' className='menu-button' />
      </a>
    </div>
  );
}
