import * as admin from 'firebase-admin';
// const serviceAccount = require('./serviceAccount.json');
import credentials from './serviceAccount';

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

export default admin;
