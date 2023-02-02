// change error
import { db } from '../firebase.js';
import {
  getDoc,
  deleteDoc,
  updateDoc,
  runTransaction,
  doc,
  setDoc,
} from '@firebase/firestore';

export const getUser = async (req, res) => {
  try {
    console.log('getuser', req.user);
    const docRef = doc(db, 'users', req.user);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({
        message: 'user does not exists',
      });
    }
    return res.status(200).json(docSnap.data());
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: error.message });
  }
};

// Update user details
export const updateUser = async (req, res) => {
  try {
    console.log('updateuser', req.body);
    const data = req.body;
    const docRef = doc(db, 'users', req.user);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return res.status(404).json({
        message: 'user does not exists',
      });
    }
    const updated = await setDoc(docRef, data, { merge: true });
    return res.status(200).json({ status: 'Updated Sucessfully' });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};
