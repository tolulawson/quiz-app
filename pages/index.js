/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Link from 'next/link';
// import { v4 as uuidv4 } from 'uuid';
// import firebase from 'firebase/app';
import 'firebase/firestore';
import PlayerContext from '../js/playerContext';

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: 'sanofi-quiz.firebaseapp.com',
//   databaseURL: 'https://sanofi-quiz.firebaseio.com',
//   projectId: 'sanofi-quiz',
//   storageBucket: 'sanofi-quiz.appspot.com',
//   messagingSenderId: '24287797751',
//   appId: '1:24287797751:web:3fe86a78dfdacaa9c7cef2',
//   measurementId: 'G-6MW35HFTT1',
// };

// let db;

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
//   db = firebase.firestore();
//   db.settings({
//     cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
//   });
//   if (process.browser) {
//     // redirect firestore requests to emulator
//     if (window.location.hostname === 'localhost' || window.location.hostname === '192.168.100.60') {
//       db.settings({
//         host: 'localhost:8080',
//         ssl: false,
//       });
//     }
//     db.enablePersistence()
//       .then(() => {
//         console.log('Persistence enabled');
//       })
//       .catch((err) => {
//         if (err.code === 'failed-precondition') {
//           window.alert('This app is open in multiple tabs. Close all tabs and relaunch the app.');
//         } else if (err.code === 'unimplemented') {
//           window.alert('The current browser does not support the features required for this app to work offline. You may continue but results will not be recorded without internet access.');
//         }
//       });
//   }
// }

// const addToFirebase = ({ collection, document, data }) => new Promise((resolve, reject) => {
//   if (document) {
//     db.collection(collection).doc(document)
//       .set(data, { merge: true })
//       .then(() => {
//         resolve();
//       })
//       .catch((err) => reject(err));
//   } else {
//     db.collection(collection)
//       .add(data)
//       .then(() => {
//         resolve();
//       })
//       .catch((err) => reject(err));
//   }
// });

// const readFromFirebase = ({ collection, document }) => new Promise((resolve, reject) => {
//   if (!document) {
//     db.collection(collection)
//       .get()
//       .then((querySnapshot) => {
//         const result = [];
//         querySnapshot.forEach((doc) => {
//           result.push(doc.data());
//         });
//         resolve(result);
//       })
//       .catch((err) => reject(err));
//   } else {
//     db.collection(collection).doc(document)
//       .get()
//       .then((doc) => {
//         if (doc.exists) {
//           resolve(doc.data());
//         } else {
//           reject();
//         }
//       })
//       .catch((err) => reject(err));
//   }
// });

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
    <div className='init-page'>
      <form className='init-form' onSubmit={handleSubmit(onSubmit)}>
        <img src='img/quiz_logo.svg' alt='quiz logo' className='quiz-logo' />
        <div className='input-fields'>
          <input
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
        </div>
        <button type='submit' className='submit-button'>
          Start
        </button>
      </form>
      <Link href='/leaderboard'>
        <a href='/leaderboard'>
          <img src='/img/leaderboard.svg' alt='home button' className='menu-button' />
        </a>
      </Link>
    </div>
  );
}

// export { firebase, addToFirebase, readFromFirebase };
