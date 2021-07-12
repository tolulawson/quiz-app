import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Link from 'next/link';
import 'firebase/firestore';
import PlayerContext from '../js/playerContext';
import PageHelmet from '../components/pageHelmet';

export default function Home() {
  const { setPlayer } = React.useContext(PlayerContext);

  const {
    register,
    handleSubmit,
    errors,
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {},
    resolver: undefined,
    context: undefined,
    criteriaMode: 'firstError',
    shouldFocusError: true,
    shouldUnregister: true,
  });
  const router = useRouter();
  const onSubmit = (data) => {
    setPlayer({
      name: data.name,
    });
    router.push('/game');
  };

  return (
    <PageHelmet>
      <div className='init-page'>
        <form className='init-form' onSubmit={handleSubmit(onSubmit)}>
          <img src='img/quiz_logo.svg' alt='quiz logo' className='quiz-logo' />
          <div className='input-fields'>
            <input
              type='text'
              placeholder='Enter a name'
              autoCapitalize='words'
              name='name'
              ref={register({ required: true })}
              autoComplete='off'
              className='text'
            />
            {
            errors.name && <span className='error-message'>This field is required</span>
          }
          </div>
          <button type='submit' className='submit-button'>
            Start
          </button>
        </form>
        <footer className='footer'>
          <Link href='/leaderboard'>
            <a href='/leaderboard'>
              <img src='/img/leaderboard.svg' alt='home button' className='menu-button' />
              Leaderboard
            </a>
          </Link>
        </footer>
      </div>
    </PageHelmet>
  );
}
