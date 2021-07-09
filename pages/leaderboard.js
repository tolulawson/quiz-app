/* eslint-disable no-nested-ternary */
import React from 'react';
import PlayerContext from '../js/playerContext';
import leaderboard from '../server/leaderboard';

export default function Leaderboard({ leaderboardData }) {
  // const [leaderboardData, setLeaderboardData] = React.useState(null);
  const { player } = React.useContext(PlayerContext);

  // React.useEffect(() => {
  //   readFromFirebase({ collection: 'quiz-sample' })
  //     .then((data) => {
  //       const sortedData = data.sort((a, b) => {
  //         const div = 10 ** Math.max(String(b.time).length, String(a.time).length);
  //         return (
  //           b.result.correctPoints - (b.time / div)) - (a.result.correctPoints - (a.time / div)
  //         );
  //       })
  //         .map((record, index) => ({ ...record, rank: index + 1 }));
  //       const currentResult = sortedData.filter((record) => record.id === player.id)[0];

  //       const slicedData = sortedData.slice(0, 10);
  //       if (player.id && !slicedData.filter((record) => record.id === player.id).length) {
  //         slicedData.push(currentResult);
  //       }
  //       setLeaderboardData(slicedData);
  //     })
  //     .catch(() => {});
  // }, []);
  return (
    <div className='leaderboard-page'>
      <div className='header'>
        <img src='/img/leaderboard.svg' alt='Leaderboard icon' />
        <h1>Leaderboard</h1>
      </div>
      {
        !leaderboardData
          ? <img src='/img/loaders.svg' className='spinner' alt='Spinner' />
          : !leaderboardData.length
            ? <p className='no-records'>It&apos;s lonely out here</p>
            : (
              <div className='leaderboard-table'>
                {
                  leaderboardData.map((record, index) => (
                    <div className={record.id === player.id ? 'leaderboard-row new' : 'leaderboard-row'} key={record.id}>
                      <span className='serial'>{`${index + 1}.`}</span>
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

export async function getServerSideProps(context) {
  const { results: leaderboardData } = await leaderboard(context.req, context.res);
  return {
    props: {
      leaderboardData,
    },
  };
}
