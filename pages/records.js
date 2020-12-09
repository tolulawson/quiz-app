import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { readFromFirebase } from './index';
import PlayerContext from '../js/playerContext';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = React.useState(null);
  const { player } = React.useContext(PlayerContext);
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);

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
    <motion.div className='records-page'>
      <motion.div className='header'>
        <motion.img src='/img/table.svg' />
        <motion.h1>Quiz Records</motion.h1>
      </motion.div>
      {
        loading
          && <motion.img src='/img/loaders.svg' className='spinner' />
      }
      <motion.iframe
        className='airtable-embed'
        src='https://airtable.com/embed/shrlV13DeesqfBSYt?backgroundColor=purple&viewControls=on'
        frameBorder='0'
        onLoad={() => setLoading(false)}
        width='90%'
        height='72%'
        style={{
          background: 'transparent',
          border: 'none',
          opacity: `${loading ? 0 : 1}`,
          transition: 'opacity 0.5s ease',
        }}
        onmousewheel=''
      />
      <motion.img src='/img/sanofi_logo_white.svg' alt='sanofi logo' className='sanofi-logo' />
      <motion.img src='/img/leaderboard.svg' alt='home button' className='menu-button settings' onClick={() => router.push('/leaderboard')} />
      <motion.img src='/img/home.svg' alt='home button' className='menu-button' onClick={() => router.push('/')} />
    </motion.div>
  );
}
