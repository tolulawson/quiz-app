/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';
import 'firebase/firestore';
import PlayerContext from '../js/playerContext';
import { generateUUID } from '../js/utils';
import PlatformChecker from '../js/platformChecker';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'sanofi-quiz.firebaseapp.com',
  databaseURL: 'https://sanofi-quiz.firebaseio.com',
  projectId: 'sanofi-quiz',
  storageBucket: 'sanofi-quiz.appspot.com',
  messagingSenderId: '24287797751',
  appId: '1:24287797751:web:3fe86a78dfdacaa9c7cef2',
  measurementId: 'G-6MW35HFTT1',
};

let db;

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  db.settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
  });
  if (process.browser) {
    // redirect firestore requests to emulator
    if (window.location.hostname === 'localhost' || window.location.hostname === '192.168.100.60') {
      db.settings({
        host: 'localhost:8080',
        ssl: false,
      });
    }
    db.enablePersistence()
      .then(() => {
        console.log('Persistence enabled');
      })
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          window.alert('This app is open in multiple tabs. Close all tabs and relaunch the app.');
        } else if (err.code === 'unimplemented') {
          window.alert('The current browser does not support the features required for this app to work offline. You may continue but results will not be recorded without internet access.');
        }
      });
  }
}

const addToFirebase = ({ collection, document, data }) => new Promise((resolve, reject) => {
  if (document) {
    db.collection(collection).doc(document)
      .set(data, { merge: true })
      .then(() => {
        resolve();
      })
      .catch((err) => reject(err));
  } else {
    db.collection(collection)
      .add(data)
      .then(() => {
        resolve();
      })
      .catch((err) => reject(err));
  }
});

const readFromFirebase = ({ collection, document }) => new Promise((resolve, reject) => {
  if (!document) {
    db.collection(collection)
      .get()
      .then((querySnapshot) => {
        const result = [];
        querySnapshot.forEach((doc) => {
          result.push(doc.data());
        });
        resolve(result);
      })
      .catch((err) => reject(err));
  } else {
    db.collection(collection).doc(document)
      .get()
      .then((doc) => {
        if (doc.exists) {
          resolve(doc.data());
        } else {
          reject();
        }
      })
      .catch((err) => reject(err));
  }
});

export default function Home({ rep: { rep, setRep } }) {
  const { setPlayer } = React.useContext(PlayerContext);

  React.useEffect(() => {
    setPlayer((player) => ({ ...player, id: '' }));
    setRep('Default User');
  }, []);
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
      ...data,
      id: generateUUID(),
    });
    router.push('/game');
  };

  const [repInput, setRepInput] = React.useState('');
  const handleRepInputChange = (e) => setRepInput(e.target.value);
  const handleRepInputSubmit = (e) => {
    e.preventDefault();
    setRep(repInput);
  };

  return (
    <motion.div className='init-page'>
      <PlatformChecker />
      <motion.form className='init-form' onSubmit={handleSubmit(onSubmit)}>
        <motion.img src='img/quiz_logo.svg' alt='quiz logo' className='quiz-logo' />
        <motion.div className='input-fields'>
          <motion.input
            type='text'
            placeholder='Enter your full name'
            autoCapitalize='words'
            name='name'
            ref={register({ required: true })}
            autoComplete='off'
            className='text'
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
            className='text'
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
            className='text'
          />
          {
            errors.email && <span className='error-message'>This field is required</span>
          }
          <motion.label className='consent'>
            <motion.input
              type='checkbox'
              name='consent'
              ref={register({ required: true })}
              className='consent-check'
            />
            <div className='privacy-notice'>
              I have read and understood the
              {' '}
              <a href='/Privacy notice.pdf'>privacy notice</a>
              {' '}
              and I consent to the collection of the provided details for informational purposes.
            </div>
          </motion.label>
          {
            errors.consent && <span className='error-message'>Check the box above to proceed</span>
          }
        </motion.div>
        <motion.button type='submit' className='submit-button'>
          Start

        </motion.button>
      </motion.form>
      {
        !rep && (
          <motion.form className='rep-setup' onSubmit={handleRepInputSubmit}>
            <motion.h3>Enter your Sanofi email to begin</motion.h3>
            <motion.input type='email' onChange={handleRepInputChange} value={repInput} className='rep-input' placeholder='Email address' />
            <motion.input type='submit' value='Submit' className='action-btn rep-submit' />
          </motion.form>
        )
      }
      {/* <motion.img src='/img/table.svg' alt='home button' className='menu-button settings' onClick={() => router.push('/records')} /> */}
      <motion.img src='/img/leaderboard.svg' alt='home button' className='menu-button' onClick={() => router.push('/leaderboard')} />
      <motion.img src='/img/sanofi_logo_white.svg' alt='sanofi logo' className='sanofi-logo' />

    </motion.div>
  );
}

export { firebase, addToFirebase, readFromFirebase };
