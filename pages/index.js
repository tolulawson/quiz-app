import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import PlayerContext from '../js/playerContext';

export default function Home({ rep: { rep, setRep } }) {
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
    setPlayer(data);
    router.push('/game');
  };

  // React.useEffect(() => {
  //   setRep(null);
  // }, []);

  const [repInput, setRepInput] = React.useState('');
  const handleRepInputChange = (e) => setRepInput(e.target.value);
  const handleRepInputSubmit = (e) => {
    e.preventDefault();
    setRep(repInput);
  };

  return (
    <motion.div className='init-page'>
      <motion.form className='init-form' onSubmit={handleSubmit(onSubmit)}>
        <motion.img src='img/quiz_logo.svg' alt='quiz logo' className='quiz-logo' />
        <motion.div className='input-fields'>
          <motion.input
            type='text'
            placeholder='Enter your name'
            autoCapitalize='words'
            name='name'
            ref={register({ required: true })}
            autoComplete='off'
          />
          {
            errors.name && <span className='error-message'>This field is required</span>
          }
          <motion.input
            type='text'
            placeholder='Pharmacy'
            autoCapitalize='words'
            name='pharmacy'
            ref={register({ required: true })}
            autoComplete='off'
          />
          {
            errors.pharmacy && <span className='error-message'>This field is required</span>
          }
          <motion.input
            type='email'
            name='email'
            ref={register({ required: true })}
            placeholder='Email'
            autoComplete='off'
          />
          {
            errors.email && <span className='error-message'>This field is required</span>
          }
        </motion.div>
        <motion.button type='submit' className='submit-button'>
          Start

        </motion.button>
      </motion.form>
      <motion.img src='/img/sanofi_logo_white.svg' alt='sanofi logo' className='sanofi-logo' />
      {
        !rep && (
          <motion.form className='rep-setup' onSubmit={handleRepInputSubmit}>
            <motion.h3>Enter your Sanofi email to begin</motion.h3>
            <motion.input type='email' onChange={handleRepInputChange} value={repInput} className='rep-input' placeholder='Email address' />
            <motion.input type='submit' value='Submit' className='action-btn' />
          </motion.form>
        )
      }
    </motion.div>
  );
}
