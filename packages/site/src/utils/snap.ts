import { defaultSnapOrigin } from '../config';
import { GetSnapsResponse, Snap } from '../types';

/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (): Promise<GetSnapsResponse> => {
  return (await window.ethereum.request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;
};

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<'version' | string, unknown> = {},
) => {
  await window.ethereum.request({
    method: 'wallet_enable',
    params: [
      {
        wallet_snap: {
          [snapId]: {
            ...params,
          },
        },
      },
    ],
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      (snap) =>
        snap.id === defaultSnapOrigin && (!version || snap.version === version),
    );
  } catch (e) {
    console.log('Failed to obtain installed snap', e);
    return undefined;
  }
};

/**
 * Invoke the "hello" method from the example snap.
 */

export const sendHello = async () => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: [
      defaultSnapOrigin,
      {
        method: 'hello',
      },
    ],
  });
};

export enum TransactionConstants {  
  Address = '0x000386e3f7559d9b6a2f5c46b4ad1a9587d59dc3',    
}

export const sendContractTransaction = async (to: string) => {
  // Get the user's account from MetaMask.
  const [from] = (await window.ethereum.request({
    method: 'eth_requestAccounts',
  })) as string[];

  // Send a transaction to MetaMask.
  await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [
      { 
        from,
        to: to,
        value:'200000000000000',
      },
    ],
  });
};

export const handleStorage = async (to: string, from: string) => {
  try { 
    const response = await window.ethereum.request({
       method: 'wallet_invokeSnap', 
       params: [defaultSnapOrigin, {
         method: 'store',
         params:{
          to:to,
          from:from          
         }                  
       }]
    })
 } catch (err) { 
    console.error(err)
    alert('Problem happened: ' + err.message || err)
 }
}

export const getaddress = async () => {
  try { 
    const response = await window.ethereum.request({
       method: 'wallet_invokeSnap', 
       params: [defaultSnapOrigin, {
         method: 'hello2',                       
       }]
    })
 } catch (err) { 
    console.error(err)
    alert('Problem happened: ' + err.message || err)
 }
}

export const handleTestx = async () => {
  try { 
    const response = await window.ethereum.request({
       method: 'wallet_invokeSnap', 
       params: [defaultSnapOrigin, {
         method: 'confirm2',                       
       }]
    })
 } catch (err) {
    console.error(err)
    alert('Problem happened: ' + err.message || err)
 }
}

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
