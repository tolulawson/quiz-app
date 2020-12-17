/* eslint-disable no-nested-ternary */
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { readFromFirebase } from './index';
import PlayerContext from '../js/playerContext';
import PlatformChecker from '../js/platformChecker';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = React.useState(null);
  const { player } = React.useContext(PlayerContext);
  const router = useRouter();

  React.useEffect(() => {
    readFromFirebase({ collection: 'quiz' })
      .then((data) => {
        const sortedData = data.sort((a, b) => {
          const div = 10 ** Math.max(String(b.time).length, String(a.time).length);
          return (
            b.result.correctPoints - (b.time / div)) - (a.result.correctPoints - (a.time / div)
          );
        })
          .map((record, index) => ({ ...record, rank: index + 1 }));
        const currentResult = sortedData.filter((record) => record.id === player.id)[0];

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
      <PlatformChecker />
      <motion.div className='header'>
        <motion.img src='/img/leaderboard.svg' />
        <motion.h1>Leaderboard</motion.h1>
      </motion.div>
      {
        !leaderboardData
          ? <motion.img src='/img/loaders.svg' className='spinner' />
          : !leaderboardData.length
            ? <motion.p className='no-records'>No records found</motion.p>
            : (
              <motion.div className='leaderboard-table'>
                {
                  leaderboardData.map((record) => (
                    <motion.div className={player.id && record.id === player.id ? 'leaderboard-row new' : 'leaderboard-row'} key={record.id}>
                      <motion.span className='serial'>{`${record.rank}.`}</motion.span>
                      <motion.span className='name'>{record.name}</motion.span>
                      <motion.span className='points'>{`${record.result.correctPoints}%`}</motion.span>
                      <motion.span className='time'>{`${record.time}s`}</motion.span>
                    </motion.div>
                  ))
                }
              </motion.div>
            )
      }
      <motion.img src='/img/home.svg' alt='home button' className='menu-button' onClick={() => router.push('/')} />
      <motion.img src='/img/table.svg' alt='home button' className='menu-button settings' onClick={() => router.push('/records')} />
      <motion.img src='/img/sanofi_logo_white.svg' alt='sanofi logo' className='sanofi-logo settings' />
    </motion.div>
  );
}
