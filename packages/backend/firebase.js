import { initializeApp } from '@firebase/app';
import { getFirestore } from '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD3oLW1wCHjpeW_3Bg1Wawgxe3H_YIeuN4',
  authDomain: 'metamask-snaps.firebaseapp.com',
  projectId: 'metamask-snaps',
  storageBucket: 'metamask-snaps.appspot.com',
  messagingSenderId: '545534581361',
  appId: '1:545534581361:web:ad4cf64927ecf2dc28d9d0',
  measurementId: 'G-N7KFPW37YB',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
