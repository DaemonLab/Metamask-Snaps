import {
  deleteDoc,
  updateDoc,
  getDoc,
  doc,
  runTransaction,
  collection,
  getDocs,
} from '@firebase/firestore';
import { db } from '../firebase.js';

export const addSplit = async (req, res) => {
  try {
    console.log('Adding a new split ', req.body);
    const data = req.body;
    const user = req.user;
    const gid = req.params.gid;
    let docRef;

    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(doc(db, 'groups', gid));

      // check if group exists
      if (!docSnap.exists()) {
        throw new Error('group does not exists');
      }

      // check if all members of data.involved are a subset of docSnap.data().members
      let members = docSnap.data().members;
      let involved = data.involved;

      let check = involved.every((involvedMember) =>
        members.hasOwnProperty(involvedMember.user),
      );

      if (!check) throw new Error('Outsiders not allowed');

      involved.forEach((involvedMember) => {
        members[involvedMember.user] += involvedMember.amount;
      });

      const transactionSnapshots = await Promise.all(
        involved.map((involvedMember) =>
          transaction.get(doc(db, 'users', involvedMember.user)),
        ),
      );

      // update the group
      transaction.update(doc(db, 'groups', gid), {
        members: members,
      });

      // make a hashmap of involved array with member as key and amount as value using reduce
      const involvedMap = involved.reduce((acc, involvedMember) => {
        acc[involvedMember.user] = involvedMember.amount;
        return acc;
      }, {});

      transactionSnapshots.forEach((transactionSnap) => {
        // update the balance of each use
        let groups = transactionSnap.data().groups;
        groups[gid] += involvedMap[transactionSnap.data().address];

        transaction.update(doc(db, 'users', transactionSnap.data().address), {
          groups: groups,
        });
      });

      // add the split
      docRef = doc(collection(db, 'groups', gid, 'splits'));
      transaction.set(docRef, {
        date: Date.now(),
        name: data.name,
        involved: involvedMap,
      });
    });

    return res.status(201).json({ split_id: docRef.id });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const deleteSplit = async (req, res) => {
  try {
    console.log('deleting a split', req.body);
    const data = req.body;
    const user = req.auth.address;
    const gid = req.params.gid;
    const sid = req.params.sid;

    const docSnap = await getDoc(doc(db, 'groups', gid));

    // check if group exists
    if (!docSnap.exists()) {
      return res.status(404).json({
        message: 'group does not exists',
      });
    }

    // check user exists in that split
    if (!docSnap.data().members.some((e) => e.user === user)) {
      return res.status(304).json({
        message: 'User not included the group',
      });
    }

    // check that the split exists
    if (!docSnap.data().splits.some(sid)) {
      return res.status(404).json({
        message: 'Split does not exixts',
      });
    }

    const docRef = await deleteDoc(doc(db, 'groups', gid, 'splits', sid));

    return res.status(201).json({ split_id: docRef.id });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const updateSplit = async (req, res) => {
  try {
    return res.status(201).json({ message: 'Feature not supported' });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const listSplits = async (req, res) => {
  try {
    console.log('Listing the Splits', req.body);
    const data = req.body;
    const gid = req.params.gid;

    const docSnap = await getDoc(doc(db, 'groups', gid));

    // check if group exists
    if (!docSnap.exists()) {
      return res.status(404).json({
        message: 'group does not exists',
      });
    }

    // check user exists in that group
    if (!docSnap.data().members.some((e) => e.user === req.user)) {
      return res.status(304).json({
        message: 'User not included the group',
      });
    }
    const querySnapshot = await getDocs(
      collection(db, 'groups', gid, 'splits'),
    );
    console.log(querySnapshot);
    const splits = querySnapshot.docs.map((doc) => doc.data());

    return res.status(201).json({ splits: splits });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

// get split details
export const getSplit = async (req, res) => {
  try {
    console.log('Getting the split details', req.body);
    const data = req.body;
    const gid = req.params.gid;
    const sid = req.params.sid;

    const docSnap = await getDoc(doc(db, 'groups', gid));

    // check if group exists
    if (!docSnap.exists()) {
      return res.status(404).json({
        message: 'group does not exists',
      });
    }

    // check user exists in that group
    if (!docSnap.data().members.some((e) => e.user === user)) {
      return res.status(304).json({
        message: 'User not included the group',
      });
    }

    // check that the split exists
    if (!docSnap.data().splits.some(sid)) {
      return res.status(404).json({
        message: 'Split does not exixts',
      });
    }

    const split = await getDoc(doc(db, 'groups', gid, 'splits', sid));
    return res.status(201).json({ split: split });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
