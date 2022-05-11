import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { auth } from './firebase-config';

const token = localStorage.getItem('token');

signInWithCustomToken(auth, token)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    console.log('Firebase response user');
    // ...
  })
  .catch((error) => {
    console.log('Firebase login error', error.message);
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });
