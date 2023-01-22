import { OnTransactionHandler, OnRpcRequestHandler } from '@metamask/snap-types';
import { getInsights } from './insights';

const apiKey = "aA_V_CFxQbVNselCHcDjB0IEhTJvZ_CU";
async function checkScam (contractAddr: string){   
    // Check if contract is spam
    const response = await fetch('https://eth-mainnet.g.alchemy.com/nft/v2/'+apiKey+'/isSpamContract?contractAddress='+contractAddr);
    return response.text(); 
}

export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  switch (request.method) {
    case 'hello':        
      return checkScam("0x000386e3f7559d9b6a2f5c46b4ad1a9587d59dc3").then(res => {
          
        return wallet.request({
          method: 'snap_confirm',
          params: [
            {
              prompt: `iufhweifrwh `,
              description:
                'This custom confirmation is just for display purposes.',
              textAreaContent:
                `${res}`,
            },
          ],
        });
    })
    default:
      throw new Error('Method not found.');
  }
};

export const onTransaction: OnTransactionHandler = async ({ transaction }) => {

  return checkScam(`${transaction.to}`).then(async res => {    
    return {
      insights: await getInsights(transaction, res)
    }
  })
  
  // return getData(`${transaction.to}`).then(async res => {     
  //   const data = JSON.parse(res) 
  //   return {    
  //     insights: await getInsights(transaction, data.completed),
  //   };
  // })
};
