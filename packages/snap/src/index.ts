/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable no-case-declarations */
import { OnRpcRequestHandler } from '@metamask/snap-types';

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
      if (!state.jobs) {return [];}
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
