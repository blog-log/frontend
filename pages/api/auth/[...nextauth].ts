import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { FirebaseAdapter } from "@next-auth/firebase-adapter";

import firebase from "firebase/app";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const firestore = (
  firebase.apps[0] ?? firebase.initializeApp(firebaseConfig)
).firestore();

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: "read:org",
    }),
  ],
  session: {
    jwt: true,
  },
  callbacks: {
    async session(session, token) {
      // Add access_token to session
      if (token?.accessToken) {
        session.accessToken = token.accessToken;
      }

      return session;
    },
    async jwt(token, user, account) {
      // Initial sign in
      if (account && user) {
        token.accessToken = account.accessToken;
        return token;
      }

      return token;
    },
  },
  adapter: FirebaseAdapter(firestore),
  debug: true,
});
