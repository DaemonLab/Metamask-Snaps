import { deleteDoc, updateDoc } from '@firebase/firestore';
import { db } from '../firebase.js';

export const addSplit = async (req, res) => {
  try {
    console.log('Adding a new split ', req.body);
    const data = req.body;
    const user = req.auth.address;
    const gid = req.params.gid;

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

    const docRef = await addDoc(collection(db, 'groups', gid, 'splits'), {
      date: Date.now(),
      name: data.name,
      involved: data.involved,
    });

    return res.status(201).json({ split_id: docRef.id });
  } catch (error) {
    return res.status(404).json({ message: error });
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
    return res.status(404).json({ message: error });
  }
};

export const updateSplit = async (req, res) => {
  try {
    console.log('Updating the split', req.body);
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

    const splitRef = doc(db, 'groups', gid, 'splits', sid);
    const updated = await updateDoc(splitRef, data, { merge: true });
    return res.status(201).json({ split_id: updated.id });
  } catch (e) {
    return res.status(404).json({ message: error });
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
    if (!docSnap.data().members.some((e) => e.user === user)) {
      return res.status(304).json({
        message: 'User not included the group',
      });
    }

    const splits = await getDoc(doc(db, 'groups', gid, 'splits'));
    return res.status(201).json({ splits: splits });
  } catch (e) {
    return res.status(404).json({ message: error });
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
  } catch (e) {
    return res.status(404).json({ message: error });
  }
};

// Add group details
export const addGroup = async (req, res) => {
  try {
    const data = req.body;
    // {id, name, type, members []}

    console.log('addgroup :', data);

    const docRef = await addDoc(collection(db, "groups"), data);
    
    var batch = db.batch();
    const groupRef = doc(db, 'groups');

    batch.set(groupRef, {
      type: data.type,
      members: data.members.map((member) => {
        return {
          member: member,
          owedBalance: 0,
        };
      }),
    });

    batch.update(doc(db, 'users', req.body), {
      groups: arrayUnion(groupRef),
    });

    batch.commit();

    // //second method
    // array.forEach(async (doc) => {
    //   var docRef = db.collection('groups').doc();
    //   batch.set(docRef, doc);
    //   await addDoc(collection(db, 'users', req.body, 'groups'), {
    //     type: req.body.type,
    //     members: req.body.member,
    //   });
    // });

    // batch.commit();
    // //end seccond method

    return res.status(200).json({ data: docSnap.data() });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

// List groups details
export const listGroups = async (req, res) => {
  try {
    console.log('listgroups', req.body);
    const docSnap = db.collection('users').doc(req.body);
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
    const groups = await getDocs(collection(db, 'users', req.body, 'groups'));

    return res.status(200).json({ data: groups.data() });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};
