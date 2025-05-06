import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDMHvbHxDvqx--kGEfWQpgRIyPRt0SNNg0",
  authDomain: "proyectoortiznosiglia.firebaseapp.com",
  projectId: "proyectoortiznosiglia",
  storageBucket: "proyectoortiznosiglia.appspot.com",
  messagingSenderId: "332901574725",
  appId: "1:332901574725:web:eefdd05015c2c321eadb2c",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage };
