// // src/firebase.ts
// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";

// // Your web app's Firebase configuration
// // use your own Firebase project configuration here
// const firebaseConfig = {
//     apiKey: "",
//     authDomain: "",
//     projectId: "",
//     storageBucket: "",
//     messagingSenderId: "",
//     appId: "",
//     measurementId: ""
//   };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const googleProvider = new GoogleAuthProvider();

//Disable firebase =>
// src/firebase.ts
// 🚫 Firebase is disabled – using dummy values instead of real Firebase setup

// Fake auth object
export const auth = {
  currentUser: null, // You can put a dummy user here if needed
};

// Fake Google provider
export const googleProvider = {
  // no methods – this is just a placeholder
};

// 🔴 Removed initializeApp, getAuth, GoogleAuthProvider imports
// so Firebase is no longer being used in the project
