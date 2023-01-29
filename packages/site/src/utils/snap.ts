import { defaultSnapOrigin } from '../config';
import { GetSnapsResponse, Snap } from '../types';
import { Buffer } from 'buffer';

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

export const login = async () => {
  console.log('login');

  const [from] = (await window.ethereum.request({
    method: 'eth_requestAccounts',
  })) as string[];

  fetch('http://localhost:4000/message?' + new URLSearchParams({
    address: from
  }))
    .then(async response => response.json())
    .then(async data => {
      if (data.error == null) {
        try {
          console.log('no error');
          const msg = `0x${Buffer.from(data.messageToSign, 'utf8').toString('hex')}`;
          const sign = await window.ethereum.request({
            method: 'personal_sign',
            params: [msg, from, 'Message Sign'],
          })
          if (sign) {
            verifySignature(from, sign.toString());
          }

        } catch (error) {
          console.log(error);

        }

      }
    });
}

const verifySignature = async (from: string, signature: string) => {
  fetch('http://localhost:4000/jwt?' + new URLSearchParams({
    address: from,
    signature: signature
  }))
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('jwt', JSON.stringify(data));
    })
}


export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
