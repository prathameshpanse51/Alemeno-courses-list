import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDwNlrBDCTr2aYpp9IQuTTBADzHquPDrk0",
  authDomain: "alemeno-courses-list.firebaseapp.com",
  projectId: "alemeno-courses-list",
  storageBucket: "alemeno-courses-list.appspot.com",
  messagingSenderId: "772437688222",
  appId: "1:772437688222:web:d8450c96d9618e4a84a08f",
};

const app = initializeApp(firebaseConfig);
export { app };
