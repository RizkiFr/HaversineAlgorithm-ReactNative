import * as firebase from "firebase";

const config={
    apiKey: "AIzaSyDYyiFEI5cuNbKwzcAcr-NQJmyxFxCpRMU",
    authDomain: "biss-4c4a4.firebaseapp.com",
    databaseURL: "https://biss-4c4a4.firebaseio.com",
    projectId: "biss-4c4a4",
    storageBucket: "biss-4c4a4.appspot.com",
    messagingSenderId: "92465420858",
    appId: "1:92465420858:web:a99ded997c0aaa11"
}

export const fb = firebase.initializeApp(config);