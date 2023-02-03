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
    console.log('deleting a split', req.params.sid);
    const user = req.user;
    const gid = req.params.gid;
    const sid = req.params.sid;


    await runTransaction(db, async (transaction) => {
      const splitSnap = await transaction.get(doc(db, 'groups', gid, 'splits', sid));
      console.log(splitSnap.data());
      const docSnap = await transaction.get(doc(db, 'groups', gid));

      // check if group exists
      if (!docSnap.exists()) throw new Error('group does not exists');
      // check if user is a member of the group
      if (!docSnap.data().members.hasOwnProperty(user)) throw new Error('User not included the group');
      // check if split exists
      if (!splitSnap.exists()) throw new Error('split does not exists');

      const involved = Object.keys(splitSnap.data().involved);
      const involvedMap = splitSnap.data().involved;
      const involvedMembersSnaps = await Promise.all(
        involved.map((involvedMember) =>
          transaction.get(doc(db, 'users', involvedMember)),
        ),
      );

      const groupBalancesMap = docSnap.data().members;

      // from group balances map remove the involved members and their balances
      involved.forEach((involvedMember) => {
        groupBalancesMap[involvedMember] -= involvedMap[involvedMember];
      });
      // from user's group balance remove the involved members and their balances
      involvedMembersSnaps.forEach((involvedMemberRef) => {
        involvedMemberRef.data().groups[gid] -= involvedMap[involvedMemberRef.data().address];
      });

      // update the group
      transaction.update(doc(db, 'groups', gid), {
        members: groupBalancesMap
      });
      // update the involved members
      involvedMembersSnaps.forEach((involvedMemberRef) => {
        transaction.update(doc(db, 'users', involvedMemberRef.data().address), {
          groups: involvedMemberRef.data().groups
        });
      });
      // delete the split
      transaction.delete(doc(db, 'groups', gid, 'splits', sid));
    });

    return res.status(201).json({ "Status": "Ok, Split deleted" });
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
    console.log('Listing the Splits');
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
    if (!docSnap.data().members.hasOwnProperty(req.user)) {
      return res.status(304).json({
        message: 'User not included the group',
      });
    }
    const querySnapshot = await getDocs(
      collection(db, 'groups', gid, 'splits'),
    );
    const splits = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

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
    if (!docSnap.data().members.hasOwnProperty(req.user)) {
      return res.status(304).json({
        message: 'User not included the group',
      });
    }

    const split = await getDoc(doc(db, 'groups', gid, 'splits', sid));
    // check that the split exists
    if (!split.data()) {
      return res.status(404).json({
        message: 'Split does not exixts',
      });
    }

    const splitData = {id: split.id, ...split.data()}
    return res.status(201).json(splitData);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
