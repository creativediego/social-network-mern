import dotenv from 'dotenv';
import * as admin from 'firebase-admin';
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.FIREBASE_CREDENTIALS!)
  ),
});

export default admin;
