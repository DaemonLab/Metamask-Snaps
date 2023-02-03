import { db } from '../firebase.js';
import {
  getDoc,
  deleteDoc,
  updateDoc,
  runTransaction,
  doc,
} from '@firebase/firestore';

// Get Contact details
export const getContact = async (req, res) => {
  try {
    console.log('getcontact');
    const docRef = doc(db, 'users', req.user);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error('user does not exists');
    return res.status(200).json(docSnap.data().contacts);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

// Add Contact details
export const addContact = async (req, res) => {
  try {
    const data = req.body;
    const user = req.user;
    console.log('user', user);
    console.log('addcontact', data);

    await runTransaction(db, async (transaction) => {
      const docRef = doc(db, 'users', user);
      const docSnap = await transaction.get(docRef);
      if (!docSnap.exists())throw 'Document does not exist!';
      else {
        let contacts = docSnap.data().contacts || {};
        let incomingContacts = data || {};
        incomingContacts.forEach(Element => {
          contacts[Element.address] = Element.name;
        });
        transaction.update(docRef, { contacts: contacts });
      }
    });
    return res.status(200).json({ status: 'OK' });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: error.message });
  }
};

// Delete Contact details
export const deleteContact = async (req, res) => {
  try {
    console.log('deletecontact', req.body);
    let docSnap = await getDoc(doc(db, 'users', req.user));
    const contacts = docSnap.data().contacts || {};
    // check if contacts object has a key with the address req.body.address
    if (!contacts.hasOwnProperty(req.body.address)) throw new Error('Contact does not exists');
    delete contacts[req.body.address];
    await updateDoc(doc(db, 'users', req.user), { contacts: contacts });
    return res.status(200).json({ status: 'OK' });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};
