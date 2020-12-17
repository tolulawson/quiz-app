import React from 'react';
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Quiz from 'react-quiz-component-remix';
import { quiz } from '../js/questions';
import { formatTime } from '../js/utils';
import PlayerContext from '../js/playerContext';
import { addToFirebase, firebase } from './index';
import PlatformChecker from '../js/platformChecker';

const renderCustomResultPage = (obj) => {
  const resultChildren = (score) => (
    <>
      <span className='emoji'>
        {
          score >= 50 ? <img src='img/happy.gif' alt='happy emoji' /> : <img src='img/sad.gif' alt='sad emoji' />
        }
      </span>
      <span className='result-text'>
        {
          score >= 50 ? `Congratulations! You scored ${score}%` : `You scored ${score}%`
        }
      </span>
    </>
  );
  ReactDOM.render(
    React.createElement('div', {
      className: 'result',
    }, resultChildren(obj.correctPoints)),
    document.querySelector('.questionWrapper'),
  );
};

export default function Game({ rep: { rep } }) {
  const questionIndexes = [];
  const selectedQuestions = [];
  const router = useRouter();

  const { player } = React.useContext(PlayerContext);

  const [timeTaken, setTimeTaken] = React.useState(0);
  const [, setStart] = React.useState(false);
  const [finished, setFinished] = React.useState(false);
  const [questions, setQuestions] = React.useState(null);

  React.useEffect(() => {
    if (!player.name) {
      router.push('/');
      return;
    }

    while (questionIndexes.length < 10) {
      const r = Math.floor(Math.random() * 12);
      if (questionIndexes.indexOf(r) === -1) {
        questionIndexes.push(r);
      }
    }
    questionIndexes.forEach((index) => selectedQuestions.push(quiz.questions[index]));
    // quiz.questions = selectedQuestions;
    // quiz.questions.length = 1;
    // eslint-disable-next-line no-debugger
    debugger;
    setQuestions({ ...quiz, questions: selectedQuestions });
  }, []);

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
      <PlatformChecker />
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
          {
            questions && (
            <Quiz
              quiz={questions}
              shuffle
              onStart={handleQuizStart}
              onComplete={handleQuizEnd}
              showDefaultResult={false}
              customResultPage={renderCustomResultPage}
            />
            )
          }
          {
            finished && (
              <motion.div className='game-end-buttons'>
                <motion.button className='action-btn refresh' onClick={() => router.push('/leaderboard')}>
                  <motion.img src='/img/leaderboard.svg' />
                  Leaderboard
                </motion.button>
                <motion.button className='action-btn refresh' onClick={() => router.push('/')}>
                  <motion.img src='/img/home.svg' />
                  Home
                </motion.button>
              </motion.div>
            )
          }
          <motion.img src='/img/sanofi_logo_white.svg' alt='sanofi logo' className='sanofi-logo' />
        </>
        )
      }
      <motion.img src='/img/home.svg' alt='home button' className='menu-button' onClick={() => router.push('/')} />
    </motion.div>
  );
}
