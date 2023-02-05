const { Alchemy, Network } = require('alchemy-sdk');

const apiKey = "aA_V_CFxQbVNselCHcDjB0IEhTJvZ_CU";
const settings = {
    apiKey: apiKey,
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

const addr = "0x000386e3f7559d9b6a2f5c46b4ad1a9587d59dc3"

const main = async (contractAddr) => {    
    const response = await alchemy.nft.isSpamContract(contractAddr);
    console.log(response + "fknwefel");

}


async function checkScam (contractAddr){   
    // Check if contract is spam
    const response = await fetch('https://eth-mainnet.g.alchemy.com/nft/v2/'+apiKey+'/getSpamContracts')
    return response; 
}

checkScam(addr);