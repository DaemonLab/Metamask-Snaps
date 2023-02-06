import {
  OnTransactionHandler,
  OnRpcRequestHandler,
} from '@metamask/snap-types';
import { OnCronjobHandler } from '@metamask/snaps-types';
import { getInsights } from './insights';
import {
  add0x,
  base64,
  bytesToHex,
  hasProperty,
  isObject,
  remove0x,
} from '@metamask/utils';
import {
  getBIP44AddressKeyDeriver,
  JsonBIP44CoinTypeNode,
  deriveBIP44AddressKey,
} from '@metamask/key-tree';
import { getPublicKey } from '@noble/bls12-381';
import { ethers } from 'ethers';

import Web3 from 'web3';

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    'https://eth-goerli.g.alchemy.com/v2/ngX1i9OUhjk8CbaLNRenO2O8eXFYKZ4D',
  ),
);

async function doesExist(address: any) {
  const response = await fetch('');
}

const apiKey = 'aA_V_CFxQbVNselCHcDjB0IEhTJvZ_CU';
const apiKey2 = 'NKU9ICH3P8KKU9ZV1UT6HZK4FUW9S77UXW';
async function checkScam(contractAddr: string) {
  // Check if contract is spam
  const response = await fetch(
    'https://eth-mainnet.g.alchemy.com/nft/v2/' +
      apiKey +
      '/isSpamContract?contractAddress=' +
      contractAddr,
  );
  return response.text();
}

async function checkTransacts(address: string) {
  // Check if account has any transaction or not
  const response = await fetch(
    `https://api.etherscan.io/api?module=account&action=balance&address=` +
      address +
      `&tag=latest&apikey=` +
      apiKey2,
  );
  return response.text();
}

async function hasTransacts(address: string) {
  // Check if account has any transaction or not
  const response = await fetch(
    `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&offset=10&sort=asc&apikey=${apiKey2}`,
  );
  return response.text();
}

const getPrivateKey = async (coinType = 60) => {
  const coinTypeNode = (await wallet.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType,
    },
  })) as JsonBIP44CoinTypeNode;

  return remove0x(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (
      await deriveBIP44AddressKey(coinTypeNode, {
        account: 0,
        change: 0,
        address_index: 0,
      })
    ).privateKey!,
  );
};

const getCustomPrivateKey = async (coinType = 501) => {
  const coinTypeNode = (await wallet.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType,
    },
  })) as JsonBIP44CoinTypeNode;

  return await deriveBIP44AddressKey(coinTypeNode, {
    account: 0,
    change: 0,
    address_index: 0,
  })
};

async function getFee() {
  // Check if account has any transaction or not
  const response = await fetch(
    `https://api.blocknative.com/gasprices/blockprices`,
  );
  return response.text();
}

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  let state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  });

  if (!state) {
    state = { jobs: [], confirmScreen: false };
    // initialize state if empty and set default data
    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  }

  switch (request.method) {
    case 'sendTron':
      console.log('start sending tron 3');
      let tronPrivateKey = await getPrivateKey(195);
      let payment = await wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: getMessage(origin),
            description:
              'Tron Payment',
            textAreaContent:
              `Request to pay ${request.params.amount} tron to ${request.params.to} `,
          },
        ],
      });
      if (payment) {
        console.log('payment accepted');

        let params = `privateKey=${tronPrivateKey}&to=${request.params.to}&amount=${request.params.amount}`;
        fetch(`http://localhost:3000/createTronTransaction?${params}`)
          .then(res => res.json())
          .then(data => {
            console.log(data);
          })
      }
      else {
        console.log('payment rejected');
      }




    case 'getTronData':
      let tronPrivateKey1 = await getPrivateKey(195);

      console.log('start getting tron data 2');
      let params1 = `privateKey=${tronPrivateKey1}`;
      const tronResponse = await fetch(`http://localhost:3000/getTronAddressDetail?${params1}`);
      const tronData = await tronResponse.json();
      console.log(tronData);
      if (tronData.success)
        return tronData;

      return { publicKey: 'no primary key', balance: 0 };


    case 'sendSolana':
      console.log('start sending solana');
      let customSolanaPrivatekey = await getCustomPrivateKey(501);

      const solanaExtendedKey = customSolanaPrivatekey.extendedKey;
      let paymentSolana = await wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: getMessage(origin),
            description:
              'Solana Payment',
            textAreaContent:
              `Request to pay ${request.params.amount} sol to ${request.params.to}`,
          },
        ],
      });
      if (paymentSolana) {
        console.log('payment accepted');
        let params2 = `extendedKey=${solanaExtendedKey}&to=${request.params.to}&amount=${request.params.amount}`;
        fetch(`http://localhost:3000/createSolanaTransaction?${params2}`)
          .then(res => res.json())
          .then(data => {
            console.log(data);
          })
      }
      else {
        console.log('payment rejected');
      }




    case 'getSolanaData':
      let customSolanaPrivatekey2 = await getCustomPrivateKey(501);

      const solanaExtendedKey2 = customSolanaPrivatekey2.extendedKey;

      console.log('start getting sol data');
      let params3 = `extendedKey=${solanaExtendedKey2}`;
      const solanaResponse = await fetch(`http://localhost:3000/getSolanaAddressDetail?${params3}`);
      const solanaData = await solanaResponse.json();
      console.log('1');
      console.log(solanaData);
      if (solanaData.success)
        return solanaData;

      return { publicAddress: 'no primary key', balance: 0 };
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
      case 'addPayment':
      console.log('Receives add job');
      console.log(request.params);
      console.log(state.payments);
      state.payments.push(request.params);
      await wallet.request({
        method: 'snap_manageState',
        params: ['update', state],
      });
      console.log('Added');
      return true;
    case 'getPayments':
      if (!state.payments) { return []; }
      return state.payments;
    case 'updatePayment':
      console.log('Received Update request');
      if (!request.params) {
        throw new Error('No id in request params');
      }
      // eslint-disable-next-line no-case-declarations
      let newState = state;
      for (let i = 0; i < newState.payments.length; i++) {
        if (newState.payments[i].id === request.params.id) {
          console.log('job before', newState.payments[i]);
          newState.payments[i] = request.params;
          console.log('job after', newState.payments[i]);
        }
      }

      await wallet.request({
        method: 'snap_manageState',
        params: ['update', newState],
      });
      console.log('updated', state);
      return true;
    case 'deletePayment':
      console.log('Received delete request');
      if (!request.params) {
        throw new Error('No id in request params');
      }
      const nwState = { payments: [], jobs: state.jobs };
      for (let i = 0; i < state.payments.length; i++) {
        if (state.payments[i].id === request.params.id) {
          continue;
        }
        nwState.payments.push(state.payments[i]);
      }

      await wallet.request({
        method: 'snap_manageState',
        params: ['update', nwState],
      });
      console.log('deleted', nwState);
      return true;
    case 'clearState':
      await wallet.request({
        method: 'snap_manageState',
        params: ['clear'],
      });
    case 'disable':
      console.log(request.params.name)
      state.jobs.filter((job: any) => job.name === request.params.name).map((job:any) => {
        console.log(job)
        if(job.active){
          job.active = false;
        }else{
          job.active = true;
        }
      })
      await wallet.request({
        method: 'snap_manageState',
        params: ['update', state],
      });
      console.log(state.jobs);
    case 'getJobs':
      if (!state.jobs) {
        return [{name:"", inputs:[], active:""}];
      }
      console.log(state.jobs[0]);
      console.log(state.jobs);
      return state.jobs;
    case 'confirm':
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: `iufhweifrwh `,
            description:
              'This custom confirmation is just for display purposes.',
            textAreaContent: `${request.params.to}`,
          },
        ],
      });
    case 'confirm2':
      return doesExist('0xf326e7afD8c78a42BF1672194dc06C0b1508eF41').then(
        (res) => {
          return wallet.request({
            method: 'snap_confirm',
            params: [
              {
                prompt: `iufhweifrwh `,
                description:
                  'This custom confirmation is just for display purposes.',
                textAreaContent: `${res}`,
              },
            ],
          });
        },
      );
    case 'addjob':
      console.log(request.params);
      console.log(state.jobs);
      state.jobs.push(request.params);
      await wallet.request({
        method: 'snap_manageState',
        params: ['update', state],
      });
      console.log(state.jobs);
      return true;
    // case 'store':
    //   state.book.push({
    //     name:request.params.to,
    //     address:request.params.from
    //   });
    //   await wallet.request({
    //     method: 'snap_manageState',
    //     params: ['update', state],
    //   });
    //   return wallet.request({
    //     method: 'snap_confirm',
    //     params: [
    //       {
    //         prompt: `iufhweifrwh `,
    //         description:
    //           'This custom confirmation is just for display purposes.',
    //         textAreaContent:
    //           `${request.params.to}`,
    //       },
    //     ],
    //   })
    // case 'hello2':
    //   let address_book = state.book.map(function(item){
    //       return `${item.name}: ${item.address}`;
    //     }).join("\n");
    //   return wallet.request({
    //     method: 'snap_confirm',
    //     params: [
    //       {
    //         prompt: `Hello, ${origin}!`,
    //         description: 'Address book:',
    //         textAreaContent: address_book,
    //       },
    //     ],
    //   });
    case 'contract':
      const privateKey = await getPrivateKey();
      // console.log(privateKey)
      const arrx = request.params.arr;
      const address = request.params.address;
      const abi = request.params.abi.result;
      const contractabi = JSON.parse(abi);

      const functionName = request.params.fname;
      const iterable = [];
      for (const [key, value] of Object.entries(arrx)) {
        iterable.push(value);
      }
      console.log(iterable);
      const contract = new web3.eth.Contract(contractabi, address);
      console.log(contract.methods[functionName](...iterable));
      const encodedFunctionCall = contract.methods[functionName](
        ...iterable,
      ).encodeABI();
      console.log(encodedFunctionCall);

      // var trxData = {
      //   to: address,
      //   data:encodedFunctionCall,
      //   gas:21000,
      //   chain:'goerli',
      //   hardfork:'petersburg'
      // };

      // web3.eth
      //   .accounts
      //   .signTransaction(trxData, privateKey)
      //   .then(function(value: any){
      //     web3.eth
      //       .sendSignedTransaction(value.rawTransaction)
      //       .then(function(response){
      //         console.log("response:" + JSON.stringify(response, null, ' '));
      //       })
      //     })

      const transaction = {
        to: address,
        data: encodedFunctionCall,
        gas: await web3.eth.getGasPrice(),
        chainId: 5,
      };
      console.log(transaction)
      console.log(privateKey);
      web3.eth.accounts.signTransaction(
        transaction,
        `${privateKey}`,
        (error: any, signedTransaction: any) => {
          if (error) {
            console.error(error);
          } else {
            web3.eth.sendSignedTransaction(
              signedTransaction.rawTransaction,
              (sendError, transactionHash) => {
                if (sendError) {
                  console.error(sendError);
                } else {
                  console.log(`Transaction hash: ${transactionHash}`);
                }
              },
            );
          }
        },
      );

      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: `Hello, !`,
            description: 'Address book:',
            textAreaContent: `flkwjf ${request.params.fname}`,
          },
        ],
      });
    case 'hello':
      return checkScam('0x000386e3f7559d9b6a2f5c46b4ad1a9587d59dc3').then(
        (res) => {
          return wallet.request({
            method: 'snap_confirm',
            params: [
              {
                prompt: `iufhweifrwh `,
                description:
                  'This custom confirmation is just for display purposes.',
                textAreaContent: `${res}`,
              },
            ],
          });
        },
      );
    default:
      throw new Error('Method not found.');
  }
};

export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  let result: any;
  let spam: any;
  let fee: any;
  let transacts: any;

  await checkTransacts(`${transaction.to}`).then(async (res) => {
    const resx = JSON.parse(res);
    result = 'ATTENTION: Recievers balance is 0';
    if (resx.result != 0) {
      result = `Recievers balance is ${resx.result}`;
    }
  });
  await checkScam(`${transaction.to}`).then(async (res) => {
    spam = res;
  });
  await getFee().then((res) => {
    const res2 = JSON.parse(res);
    fee = res2.blockPrices[0].estimatedPrices[0].maxFeePerGas;
  });
  await hasTransacts(`${transaction.to}`).then((res) => {
    const res2 = JSON.parse(res);
    transacts = res2.result.length;
  });
  return {
    insights: await getInsights(transaction, result, spam, fee, transacts),
  };
};

export const onCronjob: OnCronjobHandler = async ({ request }) => {
  let state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  });
  let s = JSON.parse(JSON.stringify(state));

  switch (request.method) {
    case 'smartContractAutomation':
      console.log('Smart Contract Automation Called');
      const privateKey = await getPrivateKey();      
      // const provider = new ethers.providers.AlchemyProvider('goerli', '1rWqgPE_9gmXzr_2VO3h4yosLFrpY1uZ');
      // const signer = new ethers.Wallet(privateKey, provider);

      // console.log('starting');

      for (let i in state.jobs) {
      if(state.jobs[i].active == true){
        let currTimestamp = Math.floor(Date.now() / 1000) + 5;
        let lastTimeStamp = state.jobs[i].lastPayment;
        let frequency = state.jobs[i].frequency;
        frequency = frequency * 60;
        let numberOf = Math.floor((currTimestamp - lastTimeStamp) / frequency);
        if (lastTimeStamp == 0) {
          numberOf = 1;
        }
        console.log(currTimestamp + ' ' + lastTimeStamp + ' ' + numberOf);
        const arrx = state.jobs[i].arr;
        const address = state.jobs[i].address;
        const abi = state.jobs[i].abi.result;
        const contractabi = JSON.parse(abi);

        const functionName = state.jobs[i].fname;
        console.log(state.jobs[i]);
        const iterable = [];
        for (const [key, value] of Object.entries(arrx)) {
          iterable.push(value);
        }
        console.log(iterable);
        const contract = new web3.eth.Contract(contractabi, address);
        console.log(contract.methods[functionName](...iterable));
        const encodedFunctionCall = await contract.methods[functionName](
          ...iterable,
        ).encodeABI();

        let gasprice = await web3.eth.getGasPrice();
        const x= 22000
        if(parseInt(gasprice)<x){
          gasprice = '23000'
        }

        const transaction = {   
          to: address,
          data: encodedFunctionCall,
          gas: gasprice,
          chainId: 5,
        };
        console.log(transaction)
        console.log(privateKey);

        if (numberOf <= 0) {
          continue;
        } else if (numberOf == 1) {
          //exec once
         
           await web3.eth.accounts.signTransaction(
            transaction,
            `${privateKey}`,
            async (error: any, signedTransaction: any) => {
              if (error) {
                console.error(error);
              } else {
                web3.eth.sendSignedTransaction(
                  signedTransaction.rawTransaction,
                  async (sendError, transactionHash) => {
                    if (sendError) {
                      console.error(sendError);
                    } else {
                      console.log(`Transaction hash: ${transactionHash}`);
                      console.log('Completed');
                    }
                  },
                );
              }
            },
          );
          // for(let i=0;i<1000;i++){
          //   console.log("")
          // }
          if (lastTimeStamp == 0) {
            state.jobs[i].lastPayment = Math.floor(Date.now() / 1000);
          } else {
            state.jobs[i].lastPayment = lastTimeStamp + frequency;
          }

          await wallet.request({
            method: 'snap_manageState',
            params: ['update', state],
          });
        } else {          
            await wallet.request({
              method: 'snap_notify',
              params: [
                {
                  prompt: `Missed Transactions`,
                  description:
                    'This notification is just for display purposes.',
                  textAreaContent: `You missed ${numberOf} transactions`,
                },
              ],
            });
           
            await web3.eth.accounts.signTransaction(
            transaction,
            `${privateKey}`,
            async (error: any, signedTransaction: any) => {
              if (error) {
                console.error(error);
              } else {
                web3.eth.sendSignedTransaction(
                  signedTransaction.rawTransaction,
                  async (sendError, transactionHash) => {
                    if (sendError) {
                      console.error(sendError);
                    } else {
                      console.log(`Transaction hash: ${transactionHash}`);
                      console.log('Completed');
                    }
                  },
                );
              }
            },
          );

              state.jobs[i].lastPayment = lastTimeStamp + frequency * numberOf;
              state.confirmScreen = false;
              await wallet.request({
                method: 'snap_manageState',
                params: ['update', state],
              });
            }
          }
        }
      }
    }
        // currentMonth++;
        // if (c == 31) {
        //   if (currentMonth == 4 || currentMonth == 6 || currentMonth == 9 || currentMonth == 11) {
        //     c = 30;
        //   }
        //   else if (currentMonth == 2) {
        //     c = 28;
        //   }
        // }
        // else if ((c == 30 || c == 29) && currentMonth == 2) {
        //   c = 28;
        // }
        // if (c <= currentDate && currentMonth != state.jobs[i].lastPayment) {
        //     console.log('match');
        //     const receipt = await signer.sendTransaction({
        //       to: state.jobs[i]['address'],
        //       value: ethers.utils.parseEther(state.jobs[i]['amount'])
        //     });
        //     console.log('payment done');

        // const arrx =state.jobs[i].arr;
        // const address = state.jobs[i].address;
        // const abi=(state.jobs[i].abi.result);
        // const contractabi = JSON.parse(abi)

        // const functionName = state.jobs[i].fname;
        // console.log(state.jobs[i])
        // const iterable=[];
        // for(const [key, value] of Object.entries(arrx)){
        //   iterable.push(value)
        // }
        // console.log(iterable)
        // const contract = new web3.eth.Contract(contractabi, address);
        // console.log(contract.methods[functionName](...iterable))
        // const encodedFunctionCall = await contract.methods[functionName](...iterable).encodeABI();

        // const transaction = {
        //   to:address,
        //   data: encodedFunctionCall,
        //   gas: 2200000,
        //   chainId:5
        // }
        // console.log(privateKey)

        // await web3.eth.accounts.signTransaction(transaction, `${privateKey}`,async (error: any, signedTransaction: any) => {
        //   if (error) {
        //     console.error(error);
        //   } else {
        //    web3.eth.sendSignedTransaction(signedTransaction.rawTransaction, async (sendError, transactionHash) => {
        //       if (sendError) {
        //         console.error(sendError);
        //       } else {
        //        console.log(`Transaction hash: ${transactionHash}`);
        //         console.log("Completed")
        //       }
        //     });
        //   }
        // });

        //         state.jobs[i].lastPayment = currentMonth;
        //         await wallet.request({
        //           method: 'snap_manageState',
        //           params: ['update', state],
        //         });
        //   }
        // }    
    
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
