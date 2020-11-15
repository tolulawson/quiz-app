import React from 'react';
import { motion } from 'framer-motion';
import Dexie from 'dexie';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = React.useState(null);
  const localdb = React.useRef(new Dexie('sanofi-quiz')).current;

  React.useEffect(() => {
    localdb.version(1).stores({
      quiz: '++,name,pharmacy,email,result,time,timestamp,uploaded,identifier',
      leaderboard: '++,name,points,time',
    });
    fetch('https://api.airtable.com/v0/appN5P8Wz0xWaeteN/Quiz%20Records?maxRecords=10&view=Grid%20view', {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const dat = data.records.map((record) => ({
          name: record.fields.Name,
          points: record.fields.Score,
          time: record.fields['Time Taken (s)'],
        }));

        localdb.leaderboard.clear()
          .then(() => {
            localdb.leaderboard.bulkPut(dat)
              .then(() => {
                localdb.leaderboard.toArray()
                  .then((arr) => {
                    setLeaderboardData(arr);
                  });
              });
          });
      })
      .catch((err) => {
        console.log(err);
        localdb.leaderboard.toArray()
          .then((arr) => {
            setLeaderboardData(arr);
            console.log(arr);
          });
      });
  }, []);
  return (
    <motion.div className='leaderboard-page'>
      <motion.div className='header'>
        <motion.img src='/img/leaderboard.svg' />
        <motion.h1>Leaderboard</motion.h1>
        {
          !leaderboardData
            ? <motion.img src='//s.svgbox.net/loaders.svg?fill=805ad5&ic=spinner' />
            : (
              <motion.div className='leaderboard-table'>
                <motion.div></motion.div>
              </motion.div>
            )
        }
      </motion.div>
    </motion.div>
  );
}
