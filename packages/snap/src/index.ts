/* eslint-disable prettier/prettier */
import { OnRpcRequestHandler } from '@metamask/snap-types';
// import { fetch } from 'node-fetch';

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
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  let state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  });
  // Initialize contacts map as an object in state
  if (!state) {
    state = { contacts: {} };
  } else if (!state.contacts) {
    state = { ...state, contacts: {} };
  }

  await wallet.request({
    method: 'snap_manageState',
    params: ['update', state],
  });

  let contacts = state.contacts;
  let contactsFromServer, contactsFromState, allContacts;

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
    case 'addContacts':
      console.log('Received add contact', request.params, contacts);
      request.params.forEach((contact) => {
        contacts[contact.address] = contact.name;
      });

      await wallet.request({
        method: 'snap_manageState',
        params: ['update', { contacts }],
      });
      return true;
    case 'getContacts':
      return contacts;

    case 'syncContacts':
      contactsFromState = contacts || {};
      console.log("Reached here, token is ", request.params.token);
      try{
        contactsFromServer = await fetch(
          'http://localhost:5000/contact',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${request.params.token}`,
            },
          },
        ).then((res) => res.json())
        .then((res) => {
          if(!res.message) {return res}
          else {throw new Error(res.message)}
        });
      } catch(e){
        console.log("Error", e);
      }
      console.log("Contacts from server", contactsFromServer);

      allContacts = { ...contactsFromServer, ...contactsFromState };
      console.log("all contacts, ", allContacts);

      // Update state
      await wallet.request({
        method: 'snap_manageState',
        params: ['update', { contacts: allContacts }],
      });

      console.log("JSON.stringify(allContacts) is ", JSON.stringify(allContacts), JSON.parse(JSON.stringify(allContacts)));
      // Update server
      console.log(`Token is Bearer ${request.params.token}`);
      try{
        await fetch('http://localhost:5000/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${request.params.token}`,
          },
          body: JSON.stringify(allContacts),
        }).then( async res => res.json())
        .then((res) => console.log("Response from server", res));
    }
    catch(e){
      console.log("Error", e);
    }
      return allContacts;
    default:
      throw new Error('Method not found.');
  }
};
