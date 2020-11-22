import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Quiz from 'react-quiz-component-remix';
import Dexie from 'dexie';
import { quiz } from '../js/questions';
import { formatTime } from '../js/utils';
import PlayerContext from '../js/playerContext';
import { addToFirebase, firebase } from './index';

export default function Game({ rep: { rep } }) {
  const router = useRouter();
  const localdb = React.useRef(new Dexie('sanofi-quiz')).current;

  const { player } = React.useContext(PlayerContext);

  React.useEffect(() => {
    if (!player.name) {
      router.push('/');
      return;
    }
    localdb.version(1).stores({
      quiz: '++,name,pharmacy,email,result,time,timestamp,uploaded,identifier',
      leaderboard: '++,name,points,time',
    });
  }, []);

  const [timeTaken, setTimeTaken] = React.useState(0);
  const [, setStart] = React.useState(false);
  const [finished, setFinished] = React.useState(false);

  const timerRef = React.useRef();
  const handleQuizStart = () => {
    const id = setInterval(() => {
      setTimeTaken((t) => t + 1);
    }, 1000);
    timerRef.current = id;
    setStart(true);
  };
  let firstEndQuizCall = false;
  const handleQuizEnd = (result) => {
    if (!firstEndQuizCall) {
      firstEndQuizCall = true;
      return;
    }
    setFinished(true);
    clearInterval(timerRef.current);
    addToFirebase({
      collection: 'quiz',
      data: {
        id: player.id,
        name: player.name,
        pharmacy: player.pharmacy,
        email: player.email,
        result,
        time: timeTaken,
        timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
        rep,
      },
    })
      .catch(() => {});
  };

  return (
    <motion.div className='game-page'>
      {
        player.name && (
          <>
            <motion.div className='hud'>
              <motion.div className='name-group hud-item'>
                <motion.img src='/img/person.svg' />
                {player && player.name}
              </motion.div>
              <motion.div className='time-group hud-item'>
                <motion.img src='/img/alarm.svg' className='alarm' />
                {formatTime(timeTaken)}
              </motion.div>
            </motion.div>
            <Quiz
              quiz={quiz}
              shuffle
              onStart={handleQuizStart}
              onComplete={handleQuizEnd}
            />
            {
              finished && (
                <motion.button className='action-btn refresh' onClick={() => router.push('/')}>
                  Home
                </motion.button>
              )
            }
            <motion.img src='/img/sanofi_logo_white.svg' alt='sanofi logo' className='sanofi-logo' />
          </>
        )
      }
    </motion.div>
  );
}
