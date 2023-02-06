import hdkey from 'hdkey';
import web3 from '@solana/web3.js';

const connection = new web3.Connection('https://api.devnet.solana.com');

export const getSolanaAddressDetail = async (req, res) => {
  try {
    const { extendedKey } = req.body;
    const masterseed = hdkey.fromExtendedKey(extendedKey);
    const path = `m/1/1/1/1`;
    const nodeData = masterseed.derive(path);
    const { publicKey, privateKey } = nodeData;
    const from = web3.Keypair.fromSeed(privateKey);
    console.log('hi');
    const balance = await connection.getBalance(from.publicKey);
    return res.send({
      success: true,
      balance: balance / web3.LAMPORTS_PER_SOL,
      publicAddress: from.publicKey.toBase58(),
    });
  } catch (e) {
    console.log(e);
    return res.send({
      success: false,
      error: e.messsage,
    });
  }
};

export const createSolanaTransaction = async (req, res) => {
  try {
    const { extendedKey, amount, to } = req.body;
    const masterseed = hdkey.fromExtendedKey(extendedKey);
    const path = `m/1/1/1/1`;

    const nodeData = masterseed.derive(path);
    const { publicKey, privateKey } = nodeData;
    const from = web3.Keypair.fromSeed(privateKey);

    const transaction = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: amount * web3.LAMPORTS_PER_SOL,
      }),
    );
    // Sign transaction, broadcast, and confirm
    const signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [from],
    );
    console.log('SIGNATURE', signature);
    return res.send({
      success: true,
      signature,
    });
  } catch (e) {
    console.log(e);
    return res.send({
      succes: false,
      error: e.messsage,
    });
  }
};
