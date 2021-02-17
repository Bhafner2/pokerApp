// src/firebase.js
import firebase from 'firebase'
const prod = {
    apiKey: "AIzaSyAV7veNM1pCnwaJ3V2Xc09WuYEfL9wWybE",
    authDomain: "pokerapp-2ed68.firebaseapp.com",
    databaseURL: "https://pokerapp-2ed68.firebaseio.com",
    projectId: "pokerapp-2ed68",
    storageBucket: "pokerapp-2ed68.appspot.com",
    messagingSenderId: "267167526773"
};
const test = {
    apiKey: "AIzaSyCBOHvuZLDGBwpBljNNucyNvvwRrdVbQOg",
    authDomain: "poker-test-b9ab3.firebaseapp.com",
    databaseURL: "https://poker-test-b9ab3.firebaseio.com",
    projectId: "poker-test-b9ab3",
    storageBucket: "poker-test-b9ab3.appspot.com",
    messagingSenderId: "267167526773"
};
firebase.initializeApp(prod);
export default firebase; 
