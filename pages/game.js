import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Quiz from 'react-quiz-component-remix';
import { quiz } from '../js/questions';

export default function Home({ player: { playerInfo } }) {
  const router = useRouter();
  React.useEffect(() => {
    if (!playerInfo) {
      router.push('/');
    }
  }, []);

  const [timeTaken, setTimeTaken] = React.useState(0);
  const [, setStart] = React.useState(false);
  const [finished, setFinished] = React.useState(false);
  const [quizRecords, setQuizRecords] = React.useState(null);

  const timerRef = React.useRef();
  const handleQuizStart = () => {
    const id = setInterval(() => {
      setTimeTaken((t) => t + 1);
    }, 1000);
    timerRef.current = id;
    setStart(true);
  };
  const handleQuizEnd = (result) => {
    clearInterval(timerRef.current);
    setFinished(true);
  }

  const formatTime = (t) => {
    const secNum = parseInt(t, 10); // don't forget the second param
    let hours = Math.floor(secNum / 3600);
    let minutes = Math.floor((secNum - (hours * 3600)) / 60);
    let seconds = secNum - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = `0${hours}`; }
    if (minutes < 10) { minutes = `0${minutes}`; }
    if (seconds < 10) { seconds = `0${seconds}`; }
    return `${minutes}:${seconds}`;
  };

  return (
    <motion.div className='game-page'>
      <motion.div className='hud'>
        <motion.div className='name-group hud-item'>
          <motion.img src='/img/person.svg' />
          {playerInfo && playerInfo.name}
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
    </motion.div>
  );
}
