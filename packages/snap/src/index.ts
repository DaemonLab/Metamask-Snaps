/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable no-case-declarations */
import { OnRpcRequestHandler } from '@metamask/snap-types';
import { OnCronjobHandler } from '@metamask/snaps-types';
import { JsonBIP44CoinTypeNode, deriveBIP44AddressKey } from '@metamask/key-tree';

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
export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
  let state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  });

  if (!state) {
    state = { jobs: [] };
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
        if (state.jobs[i]['active'] == true && c == currentDate) {
          console.log('match');
          const receipt = await signer.sendTransaction({
            to: state.jobs[i]['address'],
            value: ethers.utils.parseEther(state.jobs[i]['amount'])
          });
          console.log('payment done');
        }
      }



    default:
      throw new Error('Method not found.');
  }
}