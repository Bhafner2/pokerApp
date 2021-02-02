// src/firebase.js
import firebase from 'firebase'
const prod = {
    apiKey: "",
    authDomain: ".firebaseapp.com",
    databaseURL: ".firebaseio.com",
    projectId: "",
    storageBucket: ".appspot.com",
    messagingSenderId: ""
};
firebase.initializeApp(prod);
export default firebase; 
