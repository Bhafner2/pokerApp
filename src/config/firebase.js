// src/firebase.js
import firebase from 'firebase'
const config = {
    apiKey: <your firebase config>,
    authDomain: <your firebase config>,
    databaseURL: <your firebase config>,
    projectId: <your firebase config>,
    storageBucket: <your firebase config>,
    messagingSenderId: <your firebase config>,
};
firebase.initializeApp(config);
export default firebase; 
