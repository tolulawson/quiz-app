import React from 'react';
import { motion } from 'framer-motion';
import { readFromFirebase } from './index';
import PlayerContext from '../js/playerContext';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = React.useState(null);
  const { player } = React.useContext(PlayerContext);

  React.useEffect(() => {
    readFromFirebase({ collection: 'quiz' })
      .then((data) => {
        const sortedData = data.sort((a, b) => {
          const divB = 10 ** String(b.time).length;
          const divA = 10 ** String(a.time).length;
          return (
            b.result.correctPoints - (b.time / divB)) - (a.result.correctPoints - (a.time / divA)
          );
        })
          .map((record, index) => ({ ...record, rank: index + 1 }));
        const currentResult = sortedData.filter((record) => record.id === player.id);
        const slicedData = sortedData.slice(0, 10);
        if (player.id && !slicedData.filter((record) => record.id === player.id).length) {
          slicedData.push(currentResult);
        }
        setLeaderboardData(slicedData);
      })
      .catch(() => {});
  }, []);
  return (
    <motion.div className='leaderboard-page'>
      <motion.div className='header'>
        <motion.img src='/img/leaderboard.svg' />
        <motion.h1>Leaderboard</motion.h1>
      </motion.div>
      {
        !leaderboardData
          ? <motion.img src='/img/loaders.svg' className='spinner' />
          : (
            <motion.div className='leaderboard-table'>
              {
                leaderboardData.map((record) => (
                  <motion.div className={player.id && record.id === player.id ? 'leaderboard-row' : 'leaderboard-row new'} key={record.id}>
                    <motion.span className='serial'>{`${record.rank}.`}</motion.span>
                    <motion.span className='name'>{record.name}</motion.span>
                    <motion.span className='points'>{`${record.result.correctPoints}pts`}</motion.span>
                    <motion.span className='time'>{`${record.time}s`}</motion.span>
                  </motion.div>
                ))
            }
            </motion.div>
          )
      }
    </motion.div>
  );
}
