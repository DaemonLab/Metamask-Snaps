/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable no-case-declarations */
import { OnRpcRequestHandler, OnTransactionHandler } from '@metamask/snap-types';
import { OnCronjobHandler } from '@metamask/snaps-types';
import { JsonBIP44CoinTypeNode, deriveBIP44AddressKey } from '@metamask/key-tree';
import { getInsights } from './insights';

import { getPublicKey } from '@noble/bls12-381';
import {
  add0x,
  bytesToHex,
  hasProperty,
  isObject,
  remove0x,
} from '@metamask/utils';

import { ethers } from 'ethers';

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
async function doesExist(address: any) {
  const response = await fetch('')
}

const apiKey = "aA_V_CFxQbVNselCHcDjB0IEhTJvZ_CU";
const apiKey2 = "NKU9ICH3P8KKU9ZV1UT6HZK4FUW9S77UXW";
async function checkScam(contractAddr: string) {
  // Check if contract is spam
  const response = await fetch('https://eth-mainnet.g.alchemy.com/nft/v2/' + apiKey + '/isSpamContract?contractAddress=' + contractAddr);
  return response.text();
}

async function checkTransacts(address: string) {
  // Check if account has any transaction or not
  const response = await fetch(`https://api.etherscan.io/api?module=account&action=balance&address=` + address + `&tag=latest&apikey=` + apiKey2);
  return response.text();
}

async function hasTransacts(address: string) {
  // Check if account has any transaction or not
  const response = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&offset=10&sort=asc&apikey=${apiKey2}`);
  return response.text();
}

//

async function getFee() {
  // Check if account has any transaction or not
  const response = await fetch(`https://api.blocknative.com/gasprices/blockprices`);
  return response.text();
}
export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
  let state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  });

  if (!state) {
    state = { jobs: [], book: [] };
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
        name: request.params.to,
        address: request.params.from
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
      let address_book = state.book.map(function (item) {
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
    // case 'hello':
    //   return wallet.request({
    //     method: 'snap_confirm',
    //     params: [
    //       {
    //         prompt: getMessage(origin),
    //         description:
    //           'This custom confirmation is just for display purposes.',
    //         textAreaContent:
    //           'But you can edit the snap source code to make it do something, if you want to!',
    //       },
    //     ],
    //   });
    case 'addJob':
      console.log('Receives add job');
      console.log(request.params);
      console.log(state.jobs);
      state.jobs.push(request.params);
      await wallet.request({
        method: 'snap_manageState',
        params: ['update', state],
      });
      console.log('Added');
      return true;
    case 'getJobs':
      if (!state.jobs) { return []; }
      return state.jobs;
    case 'updateJob':
      console.log('Received Update request');
      if (!request.params) {
        throw new Error('No id in request params');
      }
      // eslint-disable-next-line no-case-declarations
      let newState = state;
      for (let i = 0; i < newState.jobs.length; i++) {
        if (newState.jobs[i].id === request.params.id) {
          console.log('job before', newState.jobs[i]);
          newState.jobs[i] = request.params;
          console.log('job after', newState.jobs[i]);
        }
      }

      await wallet.request({
        method: 'snap_manageState',
        params: ['update', newState],
      });
      console.log('updated', state);
      return true;
    case 'deleteJob':
      console.log('Received delete request');
      if (!request.params) {
        throw new Error('No id in request params');
      }
      const nwState = { jobs: [] };
      for (let i = 0; i < state.jobs.length; i++) {
        if (state.jobs[i].id === request.params.id) {
          continue;
        }
        nwState.jobs.push(state.jobs[i]);
      }

      await wallet.request({
        method: 'snap_manageState',
        params: ['update', nwState],
      });
      console.log('deleted', nwState);
      return true;
    default:
      throw new Error('Method not found.');
  }
};


export const onCronjob: OnCronjobHandler = async ({ request }) => {
  let state = await wallet.request({
    method: 'snap_manageState',
    params: ['get']
  });
  let s = JSON.parse(JSON.stringify(state));

  switch (request.method) {
    case 'recurringPayment':
      console.log('monthly new');
      const privateKey = await getPrivateKey();
      const publicKey = getPublicKey(privateKey);

      const provider = new ethers.providers.AlchemyProvider('goerli', '1rWqgPE_9gmXzr_2VO3h4yosLFrpY1uZ');
      const signer = new ethers.Wallet(privateKey, provider);

      console.log('starting');

      for (let i in state.jobs) {
        let date: String = state.jobs[i]['date'];
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
        if (state.jobs[i]['active'] == true && c <= currentDate && currentMonth != state.jobs[i]['lastPayment']) {
          console.log('match');
          const receipt = await signer.sendTransaction({
            to: state.jobs[i]['address'],
            value: ethers.utils.parseEther(state.jobs[i]['amount'])
          });
          console.log('payment done');
          state.jobs[i]['lastPayment'] = currentMonth;

          await wallet.request({
            method: 'snap_manageState',
            params: ['update', state],
          });

        }
      }



    default:
      throw new Error('Method not found.');
  }
}


export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  let result: any;
  let spam: any;
  let fee: any;
  let transacts: any;

  await checkTransacts(`${transaction.to}`).then(async res => {
    const resx = JSON.parse(res);
    result = "ATTENTION: Recievers balance is 0";
    if (resx.result != 0) {
      result = `Recievers balance is ${resx.result}`
    }
  })
  await checkScam(`${transaction.to}`).then(async res => {
    spam = res;
  })
  await getFee().then(res => {
    const res2 = JSON.parse(res);
    fee = res2.blockPrices[0].estimatedPrices[0].maxFeePerGas
  })
  await hasTransacts(`${transaction.to}`).then(res => {
    const res2 = JSON.parse(res);
    transacts = res2.result.length
  })
  return {
    insights: await getInsights(transaction, result, spam, fee, transacts)
  }
}