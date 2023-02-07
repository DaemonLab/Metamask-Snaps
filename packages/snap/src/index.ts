import {
  OnTransactionHandler,
  OnRpcRequestHandler,
} from '@metamask/snap-types';
import { OnCronjobHandler } from '@metamask/snaps-types';
import { getInsights } from './insights';
import {  
  remove0x,
} from '@metamask/utils';
import {
  JsonBIP44CoinTypeNode,
  deriveBIP44AddressKey,
} from '@metamask/key-tree';

const hdkey = require('hdkey');
var solweb3 = require("@solana/web3.js");
const base58 = require('bs58');
import { getPublicKey } from '@noble/bls12-381';

import Web3 from 'web3';
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    'https://eth-goerli.g.alchemy.com/v2/ngX1i9OUhjk8CbaLNRenO2O8eXFYKZ4D',
  ),
);

import { ethers } from 'ethers';

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
  });
};

async function getFee() {
  // Check if account has any transaction or not
  const response = await fetch(
    `https://api.blocknative.com/gasprices/blockprices`,
  );
  return response.text();
}



/**
 * Get a message from the origin. For demonstration purposes only.
 *
 * @param originString - The origin string.
 * @returns A message based on the origin.
 */
export const getMessage = (originString: string): string =>
  `Hello, ${originString}!`;

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns `null` if the request succeeded.
 * @throws If the request method is not valid for this snap.
 * @throws If the `snap_confirm` call failed.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
  let state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  });

  if (!state) {    
    state = { payments: [], jobs: [], confirmScreen: false, };    
    // initialize state if empty and set default data
    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  }

  switch (request.method) {
    case 'hello':
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: getMessage(origin),
            description:
              'This custom confirmation is just for display purposes.',
            textAreaContent:
              'But you can edit the snap source code to make it do something, if you want to!',
          },
        ],
      });   
      case 'sendTron':
      console.log('start sending tron 3');
      let tronPrivateKey = await getPrivateKey(195);
      let payment = await wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: 'Tron Payment',
            textAreaContent:
              `Payment Request:\nAmount: ${request.params.amount} tron\nTo: ${request.params.to} `,
          },
        ],
      });
      if (payment) {
        console.log('payment accepted');
        let token = request.params.token;
        let params = `privateKey=${tronPrivateKey}&to=${request.params.to}&amount=${request.params.amount}`;
        let tronRes = await fetch(`http://localhost:5000/nonevm/tron/transaction`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            privateKey: tronPrivateKey,
            to: request.params.to,
            amount: request.params.amount
          })
        })
        console.log(tronRes);


      }
      else {
        console.log('payment rejected');
      }

      return;



      case 'getTronData':
        let tronPrivateKey1 = await getPrivateKey(195);
  
        console.log('start getting tron data 2');
        let params1 = `privateKey=${tronPrivateKey1}`;
        let token2 = request.params.token;
        const tronResponse = await fetch(`http://localhost:5000/nonevm/tron/address`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token2}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            privateKey: tronPrivateKey1
          })
        });
        const tronData = await tronResponse.json();
        console.log(tronData);
        if (tronData.success)
          return tronData;
  
        return { publicKey: 'no primary key', balance: 0 };
  
      case 'exportTronPrivateKey':
        try {
          let tronPrivateKey2 = await getPrivateKey(195);
          return tronPrivateKey2;
        }
        catch (e) {
          return e.message;
        }
  
  
        case 'sendSolana':
          console.log('start sending solana');
          let customSolanaPrivatekey = await getCustomPrivateKey(501);
    
          const solanaExtendedKey = customSolanaPrivatekey.extendedKey;
          let paymentSolana = await wallet.request({
            method: 'snap_confirm',
            params: [
              {
                prompt: 'Solana Payment',
    
                textAreaContent:
                  `Payment Request:\nAmount: ${request.params.amount} sol\nTo: ${request.params.to} `,
              },
            ],
          });
          if (paymentSolana) { 
            console.log('payment accepted');
    
            let token3 = request.params.token;
            console.log(token3);
            console.log(request);
    
            let solRes = await fetch(`http://localhost:5000/nonevm/solana/transaction`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token3}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                extendedKey: solanaExtendedKey,
                to: request.params.to,
                amount: request.params.amount
              })
            })
            console.log(solRes);
    
    
    
          }
          else {
            console.log('payment rejected');
          }
    
    
    
    
        case 'getSolanaData':
          let customSolanaPrivatekey2 = await getCustomPrivateKey(501);
    
          const solanaExtendedKey2 = customSolanaPrivatekey2.extendedKey;
    
          console.log('start getting sol data 1');
          let params3 = `extendedKey=${solanaExtendedKey2}`;
          let token4 = request.params.token;
          console.log(solanaExtendedKey2);
          console.log(token4);
    
    
          const solanaResponse = await fetch(`http://localhost:5000/nonevm/solana/address`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token4}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              extendedKey: solanaExtendedKey2
            })
          });
          const solanaData = await solanaResponse.json();
          console.log(solanaData);
    
          console.log('1');
          console.log(solanaData);
          if (solanaData.success)
            return solanaData;
    
          return { publicAddress: 'no primary key', balance: 0 };
          case 'exportSolanaPrivateKey':
            try {
              let customSolanaPrivatekey3 = await getCustomPrivateKey(501);
              const solanaExtendedKey3 = customSolanaPrivatekey3.extendedKey;
      
              let masterseed = hdkey.fromExtendedKey(solanaExtendedKey3);
              const path = `m/1/1/1/1`;
      
              const nodeData = masterseed.derive(path);
              const { publicKey, privateKey } = nodeData;
              const from = solweb3.Keypair.fromSeed(privateKey);
              let pk = (base58.encode(from.secretKey));
              return pk;
            }
            catch (e) {
              return e.message;
            }
      case 'addPayment':
      console.log('Receives add job');
      console.log(request.params);
      console.log(state.payments);
      request.params.id=Math.random()*1000000;
      state.payments.push(request.params);
      await wallet.request({
        method: 'snap_manageState',
        params: ['update', state],
      });
      console.log('Added');
      return true;
    case 'getPayments':
      if (!state.payments) {
        return [];
      }
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

      case 'addjob':
        console.log(request.params);
        console.log(state.jobs);
        for(let i in state.jobs){
          state.jobs[i].active = false
        }
        state.jobs.push(request.params);      
        await wallet.request({
          method: 'snap_manageState',
          params: ['update', state],
        });
        console.log(state.jobs);
        return true;   

         case 'disable':
      console.log(request.params.name);
      for(let i in state.jobs){
        if(state.jobs[i].name === request.params.name){
          if(state.jobs[i].active == true){
            state.jobs[i].active = false;
          }
          else{
            state.jobs[i].active = true;
            state.jobs[i].lastPayment = 0;
          }
        }
        else{
          state.jobs[i].active = false;
        }
      }
      await wallet.request({
        method: 'snap_manageState',
        params: ['update', state],
      });
      console.log(state.jobs);

      case 'getJobs':
        if (!state.jobs) {
          return [{ name: '', inputs: [], active: '' }];
        }
        console.log(state.jobs[0]);
        console.log(state.jobs);
        return state.jobs; 

    default:
      throw new Error('Method not found.');
  }
};

export const onCronjob: OnCronjobHandler = async ({ request }) => {
  let state = await wallet.request({
    method: 'snap_manageState',
    params: ['get']
  });
  //let s = JSON.parse(JSON.stringify(state));

  switch (request.method) {
    case 'recurringPayment':
      console.log('monthly new');
      const privateKey = await getPrivateKey();
      const publicKey = getPublicKey(privateKey);

      const provider = new ethers.providers.AlchemyProvider('goerli', '1rWqgPE_9gmXzr_2VO3h4yosLFrpY1uZ');
      const signer = new ethers.Wallet(privateKey, provider);

      console.log('starting');

      for (let i in state.payments) {
        let date: String = state.payments[i]['date'];
        let c = parseInt(date.substring(date.lastIndexOf("-") + 1));
        let m = parseInt(date.split('-')[1]);
        let currentDate = new Date().getDate();
        let currentMonth = new Date().getMonth();
        currentMonth++;
        if (c == 31) {
          if (currentMonth == 4 || currentMonth == 6 || currentMonth == 9 || currentMonth == 11) {
            c = 30;
          }
          else if (currentMonth == 2) {
            c = 28;
          }
        }
        else if ((c == 30 || c == 29) && currentMonth == 2) {
          c = 28;
        }
        if (state.payments[i]['active'] == true && c <= currentDate && currentMonth != state.payments[i]['lastPayment']) {
          console.log('match');
          const receipt = await signer.sendTransaction({
            to: state.payments[i]['address'],
            value: ethers.utils.parseEther(state.payments[i]['amount'])
          });
          console.log('payment done');
          state.payments[i]['lastPayment'] = currentMonth;

          await wallet.request({
            method: 'snap_manageState',
            params: ['update', state],
          });

        }
      }

      case 'smartContractAutomation':
      console.log('Smart Contract Automation Called');
      const privateKey1 = await getPrivateKey();
      // const provider = new ethers.providers.AlchemyProvider('goerli', '1rWqgPE_9gmXzr_2VO3h4yosLFrpY1uZ');
      // const signer = new ethers.Wallet(privateKey, provider);

      // console.log('starting');

      for (let i = state.jobs.length-1; i>=0;i--) {
        console.log(i)
        if (state.jobs[i].active == true) {
          let currTimestamp = Math.floor(Date.now() / 1000) + 5;
          let lastTimeStamp = state.jobs[i].lastPayment;
          let frequency = state.jobs[i].frequency;
          frequency = frequency * 60;
          let numberOf = Math.floor(
            (currTimestamp - lastTimeStamp) / frequency,
          );
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
          
          let transaction = {
            to: address,
            data: encodedFunctionCall,
            gas: '50000',
            chainId: 5,
          };             

          console.log(transaction);
          console.log(privateKey1);

          if (numberOf <= 0) {
            continue;
          } else if (numberOf == 1) {
            //exec once

            await web3.eth.accounts.signTransaction(
              transaction,
              `${privateKey1}`,
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
            for(let i=0;i<100;i++){
              console.log("Extending Snap Execution Time")
            }
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
            console.log('else called');            
            const x = await wallet.request({
              method: 'snap_confirm',
              params: [
                {
                  prompt:'Missed Transactions',
                  description:
                    'This custom confirmation is just for display purposes.',
                  textAreaContent:
                    `You missed ${numberOf} transactions`,
                },
              ],
            });

            await web3.eth.accounts.signTransaction(
              transaction,
              `${privateKey1}`,
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
            console.log('transacted');
            for(let i=0;i<100;i++){
              console.log("Extending Snap Execution Time")
            }
           
            state.jobs[i].lastPayment = lastTimeStamp + frequency * numberOf;
            await wallet.request({
              method: 'snap_manageState',
              params: ['update', state],
            });
          }
        }
      }

    default:
      throw new Error('Method not found.');
  }
}
