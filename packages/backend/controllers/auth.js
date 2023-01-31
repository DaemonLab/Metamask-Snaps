import jwt from 'jsonwebtoken';
import Web3 from 'web3';
import { doc, setDoc } from '@firebase/firestore';
import { db } from '../firebase.js';

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

export const login = async (req, res) => {
  const { address, signature, time } = req.body;

  const signatureValidity = 5;
  const now = new Date().getTime();
  const difference = (now - time) / 1000 / 60;

  if (difference > signatureValidity) {
    return res.status(401).json({
      message: `Signature expired.\nMaximum Validity: ${signatureValidity} minutes`,
    });
  }

  const message = JSON.stringify({
    address: address,
    time: time,
  });

  const hashedMessage = Web3.utils.sha3(message);

  try {
    const recoveredAddress = web3.eth.accounts.recover(
      hashedMessage,
      signature,
    );
    if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
      const accessToken = jwt.sign(
        { address },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' },
      );
      const refreshToken = jwt.sign(
        { address },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: '7d',
        },
      );
      await setDoc(doc(db, 'users',address ), {address : address},{merge:true})
      res.json({ accessToken, refreshToken });
    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const refresh = (req, res) => {
  const { refreshToken } = req.body;

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKN_SECRET);
    const accessToken = jwt.sign(
      { address: decoded.address },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '1h',
      },
    );
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: 'Refresh token is invalid' });
  }
};
