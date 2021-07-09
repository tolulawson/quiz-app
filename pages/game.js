/* eslint-disable max-len */
import React from 'react';
// import ReactDOM from 'react-dom';
// import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Quiz from 'react-quiz-component-remix';
import { quiz } from '../js/questions';
import { formatTime } from '../js/utils';
import PlayerContext from '../js/playerContext';
// import { addToFirebase, firebase } from './index';

// const renderCustomResultPage = (obj) => {
//   const resultChildren = (score) => (
//     <>
//       <span className='emoji'>
//         {
//           score >= 50 ? <img src='img/happy.gif' alt='happy emoji' /> : <img src='img/sad.gif' alt='sad emoji' />
//         }
//       </span>
//       <span className='result-text'>
//         {
//           score >= 50 ? `Congratulations! You scored ${score}%` : `You scored ${score}%`
//         }
//       </span>
//     </>
//   );
//   ReactDOM.render(
//     React.createElement('div', {
//       className: 'result',
//     }, resultChildren(obj.correctPoints)),
//     document.querySelector('.questionWrapper'),
//   );
// };

export default function Game() {
  const questionIndexes = [];
  const selectedQuestions = [];
  const router = useRouter();

  const { player, setPlayer } = React.useContext(PlayerContext);

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
    selectedQuestions.length = 1;
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
    fetch('api/leaderboard', {
      method: 'Post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...player,
        score: result.correctPoints,
        timeTaken,
      }),
    }).then((res) => res.json())
      .then((data) => setPlayer((currentPlayer) => ({
        ...currentPlayer,
        id: data.id,
      })));
  };

  return (
    <div className='game-page'>
      {
        player.name && (
        <>
          <div className='hud'>
            <div className='name-group hud-item'>
              <img src='/img/person.svg' alt='person icon' />
              {player.name}
            </div>
            <div className='time-group hud-item'>
              <img src='/img/alarm.svg' alt='clock icon' className='alarm' />
              {formatTime(timeTaken)}
            </div>
          </div>
          {
            questions && (
            <Quiz
              quiz={questions}
              shuffle
              onStart={handleQuizStart}
              onComplete={handleQuizEnd}
            />
            )
          }
          {
            finished && (
              <div className='game-end-buttons'>
                <Link href='/leaderboard'>
                  <a className='action-btn refresh' href='/leaderboard'>
                    <img src='/img/leaderboard.svg' alt='Leaderboard icon' />
                    Leaderboard
                  </a>
                </Link>
                <Link href='/'>
                  <a className='action-btn refresh' href='/'>
                    <img src='/img/home.svg' alt='Home icon' />
                    Home
                  </a>
                </Link>
              </div>
            )
          }
        </>
        )
      }
      <a href='/'>
        <img src='/img/home.svg' alt='home button' className='menu-button' />
      </a>
    </div>
  );
}
