// src/firebase.js
import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyAV7veNM1pCnwaJ3V2Xc09WuYEfL9wWybE",
    authDomain: "pokerapp-2ed68.firebaseapp.com",
    databaseURL: "https://pokerapp-2ed68.firebaseio.com",
    projectId: "pokerapp-2ed68",
    storageBucket: "pokerapp-2ed68.appspot.com",
    messagingSenderId: "267167526773"
};
firebase.initializeApp(config);
export default firebase;