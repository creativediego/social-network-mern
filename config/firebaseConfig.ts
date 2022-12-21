import * as admin from 'firebase-admin';
import credentials from './serviceAccount';

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(credentials)),
});

export default admin;
