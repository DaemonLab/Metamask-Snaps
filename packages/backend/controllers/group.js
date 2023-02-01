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

      const group = {
        groupId: groupRef,
        balanceOwed: 0,
      };

      const transactionSnapshots = await Promise.all(
        data.members.map((mem) => getDoc(doc(db, 'users', mem))),
      );

      transactionSnapshots.forEach((transactionSnap) => {
        if (transactionSnap.exists()) {
          let groups = transactionSnap.data().groups || [];
          groups.push(group);
          transaction.update(transactionSnap.ref, { groups: groups });
        }
      });

      transaction.set(groupRef, {
        name: data.name,
        type: data.type,
        members: data.users.map((member) => {
          return {
            user: member,
            owedBalance: 0,
          };
        }),
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
      return res.status(404).json({
        message: 'user does not exists',
      });
    }

    if (!docSnap.data().groups) {
      return res.status(404).json({
        message: 'you are not part of any group',
      });
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

      const members = groupSnap.data().members || [];
      console.log();
      if (members.some((member) => member.user === data.address)) {
        throw new Error('User already a member!');
      }

      members.push({
        user: data.address,
        owedBalance: 0,
      });

      const groups = userSnap.data().groups || [];
      groups.push({
        groupId: groupRef,
        balanceOwed: 0,
      });

      transaction.set(userRef, { groups: groups }, { merge: true });
      transaction.set(groupRef, { members: members }, { merge: true });
    });

    return res.status(200).json({ status: 'OK' });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};
