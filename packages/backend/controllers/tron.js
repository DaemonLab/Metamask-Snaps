import TronWeb from 'tronweb';

const fullNode = 'https://api.shasta.trongrid.io';
const solidityNode = 'https://api.shasta.trongrid.io';
const eventServer = 'https://api.shasta.trongrid.io';

export const getTronAddressDetail = async (req, res) => {
  try {
    const { privateKey } = req.body;
    console.log(privateKey);
    const tronWeb = new TronWeb(
      fullNode,
      solidityNode,
      eventServer,
      privateKey,
    );
    const publicKey = tronWeb.address.fromPrivateKey(privateKey);
    console.log(publicKey);
    const balance = await tronWeb.trx.getBalance(publicKey);
    return res.send({
      success: true,
      publicKey,
      balance: balance / 1000000,
    });
  } catch (e) {
    console.log(e);
    return res.send({ success: false, error: e.message });
  }
};

export const createTronTransaction = async (req, res) => {
  try {
    const { privateKey, to, amount } = req.body;
    const tronWeb = new TronWeb(
      fullNode,
      solidityNode,
      eventServer,
      privateKey,
    );
    await tronWeb.trx.sendTransaction(to, amount * 1000000);
    return res.send({ success: true });
  } catch (e) {
    console.log(e);
    return res.send({ success: false, error: e.message });
  }
};
