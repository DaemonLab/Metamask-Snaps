const express = require('express');
const cors = require('cors');
const Web3 = require('web3');
const { recoverPersonalSignature } = require('eth-sig-util')
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');
const { firestore } = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const app = express();
const PORT = 4000;

app.use(cors());

const isValidEthAddress = (address) => Web3.utils.isAddress(address);

const generateNonce = () => {
    return Math.floor(Math.random() * 1000000);
}

const getMessageToSign = async (req, res) => {
    try {
        const { address } = req.query;

        if (!isValidEthAddress(address)) {
            return res.send({
                error: 'invalid address'
            });
        }

        const nonce = generateNonce();
        let messageToSign = `Wallet address : ${address} \nNonce : ${nonce}`;

        const user = await admin.firestore().collection('users').doc(address).get();

        if (user.data() && user.data().address) {
            //user already exists
            admin.firestore().collection('users').doc(address).update({
                messageToSign
            })
        }
        else {
            admin.firestore().collection('users').doc(address).set({
                address,
                messageToSign
            }, {
                merge: true
            })
        }

        return res.send({ messageToSign, error: null });

    } catch (error) {
        console.log(error);
        return res.send({ error: 'error while generating message to sign' });
    }
}

const isValidSignature = (address, signature, messageToSign) => {

    if (!address || !signature || !messageToSign) {
        return false;
    }

    const signingAddress = recoverPersonalSignature({
        data: messageToSign,
        sig: signature
    });

    if (!signingAddress) {
        return false;
    }


    return signingAddress.toLowerCase() === address.toLowerCase();
}

const getJWT = async (req, res) => {
    try {
        const { address, signature } = req.query;

        if (!isValidEthAddress(address) || !signature) {
            return res.send({ error: "invalid parameters" });
        }

        const [customToken, doc] = await Promise.all([
            admin.auth().createCustomToken(address),
            admin.firestore().collection('users').doc(address).get()
        ])


        if (!doc.exists) {
            return res.send({ error: 'invalid message to sign' });
        }
        const { messageToSign } = doc.data();

        if (!messageToSign) {
            return res.send({ error: "invalid message to sign" })
        }

        const validSignature = isValidSignature(address, signature, messageToSign);

        if (!validSignature) {
            return res.send({
                error: 'invalid signature'
            });
        }
        await firestore().collection('users').doc(address).update({
            messageToSign: null,
        });
        return res.send({ customToken, error: null })
    } catch (error) {
        console.log(error);
        return res.send({ error: 'error' })
    }
}

app.get('/message', getMessageToSign);
app.get('/jwt', getJWT);

app.listen(PORT, () => {
    console.log(`Server is listening on port : ${PORT}`);
})