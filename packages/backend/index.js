import { db } from './firebase.js';
import express from 'express';
import Web3 from 'web3';
// import { db } from './firebase';
// const express = require('express');

// const cors = require('cors');
// const { recoverPersonalSignature } = require('eth-sig-util');

const app = express();
const PORT = 4000;

// app.use(cors());
console.log('working til here');

// import groupRoute from './routes/group';
// app.use('/groups', groupRoute);

// import userRoute from './routes/user';
// app.use('/user', userRoute);

const isValidEthAddress = (address) => Web3.utils.isAddress(address);

const generateNonce = () => {
  return Math.floor(Math.random() * 1000000);
};

// const getMessageToSign = async (req, res) => {
//   try {
//     const { address } = req.query;

//     if (!isValidEthAddress(address)) {
//       return res.send({
//         error: 'invalid address',
//       });
//     }

//     const nonce = generateNonce();
//     let messageToSign = `Wallet address : ${address} \nNonce : ${nonce}`;

//     const user = await admin.firestore().collection('users').doc(address).get();

//     if (user.data() && user.data().address) {
//       //user already exists
//       admin.firestore().collection('users').doc(address).update({
//         messageToSign,
//       });
//     } else {
//       admin.firestore().collection('users').doc(address).set(
//         {
//           address,
//           messageToSign,
//         },
//         {
//           merge: true,
//         },
//       );
//     }

//     return res.send({ messageToSign, error: null });
//   } catch (error) {
//     console.log(error);
//     return res.send({ error: 'error while generating message to sign' });
//   }
// };

// const isValidSignature =  (address, signature, messageToSign) => {
//   if (!address || !signature || !messageToSign) {
//     return false;
//   }

//   const signingAddress = recoverPersonalSignature({
//     data: messageToSign,
//     sig: signature,
//   });

//   if (!signingAddress) {
//     return false;
//   }

//   return signingAddress.toLowerCase() === address.toLowerCase();
// };

// const getJWT = async (req, res) => {
//   try {
//     const { address, signature } = req.query;

//     if (!isValidEthAddress(address) || !signature) {
//       return res.send({ error: 'invalid parameters' });
//     }

//     const [customToken, doc] = await Promise.all([
//       admin.auth().createCustomToken(address),
//       admin.firestore().collection('users').doc(address).get(),
//     ]);

//     if (!doc.exists) {
//       return res.send({ error: 'invalid message to sign' });
//     }
//     const { messageToSign } = doc.data();

//     if (!messageToSign) {
//       return res.send({ error: 'invalid message to sign' });
//     }

//     const validSignature = isValidSignature(address, signature, messageToSign);

//     if (!validSignature) {
//       return res.send({
//         error: 'invalid signature',
//       });
//     }

//     await firestore().collection('users').doc(address).update({
//       messageToSign: null,
//     });
//     return res.send({ customToken, error: null });
//   } catch (error) {
//     console.log(error);
//     return res.send({ error: 'error' });
//   }
// };

// app.get('/message', getMessageToSign);
// app.get('/jwt', getJWT);

app.listen(PORT, () => {
  console.log(`Server is listening on port : ${PORT}`);
  console.log(`db is`, db);
});

// *******************
// TODO : change ashwin's code to be workable i.e. now app is imported from `firebaase.js`
