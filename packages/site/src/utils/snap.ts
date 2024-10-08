import { defaultSnapOrigin } from '../config';
import { GetSnapsResponse, Snap } from '../types';
import Web3 from 'web3';

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

export const addData = async (obj: object) => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: [
      defaultSnapOrigin,
      {
        method: 'addPayment',
        params: obj,
      },
    ],
  });
};

export const getData = async () => {
  const data = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: [
      defaultSnapOrigin,
      {
        method: 'getPayments',
      },
    ],
  });
  return data;
};

export const deleteData = async (data: any) => {
  try {
    await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: [
        defaultSnapOrigin,
        {
          method: 'deletePayment',
          params: data,
        },
      ],
    });
  } catch (e) {
    console.error(e);
  }
};

export const updateData = async (data: any) => {
  try {
    await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: [
        defaultSnapOrigin,
        {
          method: 'updatePayment',
          params: data,
        },
      ],
    });
  } catch (e) {
    console.error(e);
  }
};

export const login = async () => {
  const [from] = (await window.ethereum.request({
    method: 'eth_requestAccounts',
  })) as string[];

  const msg = {
    address: from,
    time: new Date().getTime(),
  };
  const messageHash = Web3.utils.sha3(JSON.stringify(msg));
  const sign = await window.ethereum.request({
    method: 'personal_sign',
    params: [messageHash, from],
  });

  const res = await fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      signature: sign,
      address: from,
      time: msg.time,
    }),
  });

  const data = await res.json();
  localStorage.setItem('access_token', data.accessToken);
  localStorage.setItem('refresh_token', data.refreshToken);
};

export const sendTron = async (obj: object) => {
  console.log('snap call');
  console.log(obj);


  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: [
      defaultSnapOrigin,
      {
        method: 'sendTron',
        params: obj
      },
    ],
  });
};


export const getTronAddressData = async (token: String) => {
  const data = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: [
      defaultSnapOrigin,
      {
        method: 'getTronData',
        params: {
          token: token
        }
      },
    ],
  });
  return data;
};
export const exportTronPrivateKey = async () => {
  const data = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: [
      defaultSnapOrigin,
      {
        method: 'exportTronPrivateKey',
      },
    ],
  });
  return data;
};
export const sendSolana = async (obj: object) => {
  console.log('snap call');
  console.log(obj);


  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: [
      defaultSnapOrigin,
      {
        method: 'sendSolana',
        params: obj
      },
    ],
  });
};



export const getSolanaAddressData = async (token: String) => {
  const data = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: [
      defaultSnapOrigin,
      {
        method: 'getSolanaData',
        params: {
          token: token
        }

      },
    ],
  });
  return data;
};

export const exportSolanaPrivateKey = async () => {
  const data = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: [
      defaultSnapOrigin,
      {
        method: 'exportSolanaPrivateKey',
      },
    ],
  });
  return data;
};

export const addjob = async (name: any, arr: any, address: any, abi:any, fname: any, frequency: any,gas:any, timestamp: any ) => {
  try { 
    const response = await window.ethereum.request({
       method: 'wallet_invokeSnap', 
       params: [defaultSnapOrigin, {
         method: 'addjob',
         params:{
          name: name,
          arr: arr,
          address: address,          
          abi:abi,
          fname: fname,                    
          frequency: frequency,
          gas:gas,
          timestamp: timestamp,
          active: true,
          lastPayment:0,          
         }
       }]
    })
 } catch (err) {
    console.error(err)
    alert('Problem happened: ' + err.message || err)
 }
}

export const getjobs = async () => {
  const data = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: [
      defaultSnapOrigin,
      {
        method: 'getJobs',
      },
    ],
  });
  return data;
};

export const disable =async (name:any) => {  
  const data = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: [
      defaultSnapOrigin,
      {
        method: 'disable',
        params:{
          name: name
        }
      },
    ],
  });
  return data;
}

export const clearState = async () => {
  const data = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: [
      defaultSnapOrigin,
      {
        method: 'clearState',
      },
    ],
  });
  return data;
};




export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
