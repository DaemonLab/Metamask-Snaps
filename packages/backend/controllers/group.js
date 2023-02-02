import {
  deleteDoc,
  updateDoc,
  getDoc,
  doc,
  runTransaction,
  collection,
} from '@firebase/firestore';
import { db } from '../firebase.js';

// Add group details
export const addGroup = async (req, res) => {
  try {
    const data = req.body;
    console.log('addgroup :', data);

    await runTransaction(db, async (transaction) => {
      const groupRef = doc(collection(db, 'groups'));

      const transactionSnapshots = await Promise.all(
        data.users.map((mem) => getDoc(doc(db, 'users', mem))),
      );

      transactionSnapshots.forEach((transactionSnap) => {
        if (transactionSnap.exists()) {
          let groups = transactionSnap.data().groups || {};
          groups[groupRef.id] = 0;
          transaction.update(transactionSnap.ref, { groups: groups });
        }
      });

      const members = transactionSnapshots.reduce((acc, transactionSnap) => {
        if (transactionSnap.exists()) acc[transactionSnap.data().address] = 0;
        return acc;
      }, {});

      console.log(members);
      transaction.set(groupRef, {
        name: data.name,
        type: data.type,
        members: members,
      });
    });

    return res.status(200).json({ status: 'success' });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

// List user's groups
export const listGroups = async (req, res) => {
  try {
    console.log('listgroups', req.user);
    const docSnap = await getDoc(doc(db, 'users', req.user));

    if (!docSnap.exists()) {
      throw new Error('user does not exists');
    }

    if (!docSnap.data().groups) {
      throw new Error('you are not part of any group');
    }
    const data = docSnap.data().groups;
    console.log('groups', data);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

// get Group details
export const getGroup = async (req, res) => {
  try {
    console.log('getgroup', req.body, req.params.gid);
    const docSnap = await getDoc(doc(db, 'groups', req.params.gid));

    if (!docSnap.exists()) {
      throw new Error('group does not exists');
    }

    // check if user is part of the group
    if (!docSnap.data().members.some((e) => e.user === req.user)) {
      throw new Error('User not part of this group');
    }

    return res.status(200).json(docSnap.data());
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

// Add member to group
export const addMember = async (req, res) => {
  try {
    const data = req.body;
    console.log('addMember :', data);

    await runTransaction(db, async (transaction) => {
      const userRef = doc(db, 'users', data.address);
      const groupRef = doc(db, 'groups', data.groupId);
      const groupSnap = await transaction.get(groupRef);
      const userSnap = await transaction.get(userRef);

      if (!userSnap.exists()) {
        console.log();
        throw new Error('User does not exist!');
      }

      if (!groupSnap.exists()) {
        throw new Error('Group does not exist!');
      }

      const members = groupSnap.data().members || {};

      // check if data.address is already in members map
      if (members[data.address]) {
        throw new Error('User already part of the group!');
      }

      members[data.address] = 0;
      const groups = userSnap.data().groups || {};
      groups[data.groupId] = 0;
      transaction.set(userRef, { groups: groups }, { merge: true });
      transaction.set(groupRef, { members: members }, { merge: true });
    });

    return res.status(200).json({ status: 'OK' });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};
