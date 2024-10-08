import { products, categories } from "./data.js";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDiu9l6CHvbhrX3yfAILM1Zoz1mixDvBYg",
  authDomain: "e-commerce-store-cffdf.firebaseapp.com",
  projectId: "e-commerce-store-cffdf",
  storageBucket: "e-commerce-store-cffdf.appspot.com",
  messagingSenderId: "265629129358",
  appId: "1:265629129358:web:42a91d0e5ee9ac5f7307df"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);




export {db}
