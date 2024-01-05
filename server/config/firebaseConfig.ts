import dotenv from 'dotenv';
import * as admin from 'firebase-admin';
dotenv.config();

/**
 * firebaseConfig module.
 *
 * It initializes the Firebase Admin SDK with a service account credential, which is parsed from a JSON string stored in the `API_FIREBASE_CREDENTIALS` environment variable.
 *
 * The Firebase Admin SDK is exported as the default export of this module.
 *
 * @module firebaseConfig
 */
admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.API_FIREBASE_CREDENTIALS!)
  ),
});

export default admin;
