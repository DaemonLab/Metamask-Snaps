import { OnTransactionHandler, OnRpcRequestHandler } from '@metamask/snap-types';
import { getInsights } from './insights';

async function doesExist (address: any){
  const response = await fetch('')
}

const apiKey = "aA_V_CFxQbVNselCHcDjB0IEhTJvZ_CU";
const apiKey2 = "NKU9ICH3P8KKU9ZV1UT6HZK4FUW9S77UXW";
async function checkScam (contractAddr: string){   
    // Check if contract is spam
    const response = await fetch('https://eth-mainnet.g.alchemy.com/nft/v2/'+apiKey+'/isSpamContract?contractAddress='+contractAddr);
    return response.text(); 
}

async function checkTransacts (address: string){   
  // Check if account has any transaction or not
  const response = await fetch(`https://api.etherscan.io/api?module=account&action=balance&address=`+address+`&tag=latest&apikey=`+apiKey2);
  return response.text(); 
}

export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {

  let state = await wallet.request({
    method: "snap_manageState",
    params: ["get"],
  });

  if (!state) {
    state = {book:[]}; 
    // initialize state if empty and set default data
    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  }

  switch (request.method) {
    case 'confirm':      
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: `iufhweifrwh `,
            description:
              'This custom confirmation is just for display purposes.',
            textAreaContent:
              `${request.params.to}`,
          },
        ],
      })
    case 'confirm2':
      return doesExist("0xf326e7afD8c78a42BF1672194dc06C0b1508eF41").then(res => {
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
        })
      })
    case 'store':
      state.book.push({
        name:request.params.to,
        address:request.params.from
      });
      await wallet.request({
        method: 'snap_manageState', 
        params: ['update', state], 
      }); 
      return wallet.request({
        method: 'snap_confirm', 
        params: [
          {
            prompt: `iufhweifrwh `,
            description:
              'This custom confirmation is just for display purposes.',
            textAreaContent:
              `${request.params.to}`,
          },
        ],
      })
    case 'hello2':
      let address_book = state.book.map(function(item){
          return `${item.name}: ${item.address}`; 
        }).join("\n"); 
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: `Hello, ${origin}!`,
            description: 'Address book:',
            textAreaContent: address_book,
          },
        ],
      });
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
  let result: any;
  let spam: any;
  await checkTransacts(`${transaction.to}`).then( async res => {   
    const resx=JSON.parse(res);    
    result="ATTENTION: Recievers balance is 0"; 
    if(resx.result != 0){
      result = `Recievers balance is ${resx.result}`
    }    
  }) 
  await checkScam(`${transaction.to}`).then(async res => {
    spam=res;
  })
  return {
    insights: await getInsights(transaction, result, spam)
  } 
  }


// export const onTransaction: OnTransactionHandler = async ({ transaction }) => {

//   let state = await wallet.request({
//     method: "snap_manageState",
//     params: ["get"],
//   });
  
//   if (!state) {
//     state = {book:[]}; 
//     // initialize state if empty and set default data
//     await wallet.request({
//       method: 'snap_manageState',
//       params: ['update', state],
//     });
//   }
    
//     let name = `flkexxxn`  
//     await state.book.map(function(item: any){
//       const x = `${item.address}`
//       const y = `${transaction.to}`
//       name = `${item.name}`
//       // if(x == y){
//       //   name = `${item.name}`
//       // }
//     }
//     )
//     return {
//       insights: await getInsights(transaction, name)
//     }
//   }

//0xeDefe42ce222970A150f0fc010D21928Bf36fBC0