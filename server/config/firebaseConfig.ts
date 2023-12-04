import dotenv from 'dotenv';
import * as admin from 'firebase-admin';
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.API_FIREBASE_CREDENTIALS!)
  ),
});

export default admin;
