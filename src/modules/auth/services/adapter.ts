import type { Adapter } from "next-auth/adapters";
import { TypeORM } from "next-auth/adapters";
import { FirebaseAdapter } from "@next-auth/firebase-adapter";

import firebase from "firebase/app";
import "firebase/firestore";

export const getAdapter = (): ReturnType<Adapter> => {
  switch (process.env.DATABASE_TYPE) {
    case "firebase":
      return getFirebaseAdapter();
    case "postgres":
      return getTypeormAdapter();
    default:
      throw new Error(`unsupported database type ${process.env.DATABASE_TYPE}`);
  }
};

function getFirebaseAdapter(): ReturnType<Adapter> {
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

  return FirebaseAdapter(firestore);
}

function getTypeormAdapter(): ReturnType<Adapter> {
  return TypeORM.Adapter({
    type: "postgres",
    url: process.env.DATABASE_URI,
    synchronize: true,
  });
}
