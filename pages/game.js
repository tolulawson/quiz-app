import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Quiz from 'react-quiz-component-remix';
import Dexie from 'dexie';
import { quiz } from '../js/questions';
import { formatTime } from '../js/utils';
import PlayerContext from '../js/playerContext';

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
    localdb.quiz.put({
      name: player.name,
      pharmacy: player.pharmacy,
      email: player.email,
      result,
      time: timeTaken,
      timestamp: Date.now(),
      uploaded: false,
    })
      .then((key) => {
        localdb.quiz.get(key)
          .then((record) => {
            fetch('https://api.airtable.com/v0/appN5P8Wz0xWaeteN/Quiz%20Records', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                records: [
                  {
                    fields: {
                      Name: record.name,
                      'Pharmacy Name': record.pharmacy,
                      Timestamp: new Date(record.timestamp).toLocaleString(),
                      'Time Taken (s)': String(record.time),
                      Score: String(record.result.correctPoints),
                      Email: record.email,
                      Rep: rep,
                      Questions: record.result.questions.map((item) => `"${item.question}"`).join(', '),
                      Responses: record.result.userInput.map((item) => `"${String(item)}"`).join(', '),
                    },
                  },
                ],
              }),
            })
              .then((res) => res.json())
              .then(() => {
                localdb.quiz.update(key, {
                  uploaded: true,
                });
              });
          });
      });
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
