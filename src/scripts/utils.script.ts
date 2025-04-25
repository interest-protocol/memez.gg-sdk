import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import dotenv from 'dotenv';
import invariant from 'tiny-invariant';
import util from 'util';

import { makeMemezAclSdk } from '../memez/acl';
import { ConfigSDK } from '../memez/config';
import { MemezPumpSDK } from '../memez/pump';
import { MemezStableSDK } from '../memez/stable';

dotenv.config();

invariant(process.env.KEY, 'Private key missing');

export const keypair = Ed25519Keypair.fromSecretKey(
  Uint8Array.from(Buffer.from(process.env.KEY, 'base64')).slice(1)
);

export const TEST_POOL_ID =
  '0x7fb820bee5d04dcc733d11a4434ec4c7bba5ef5434173d723f581f3129281792';

export const TEST_STABLE_POOL_ID =
  '0x4565f3bcef4e1b93ad6cbddd1e12a31355c7c6a9a068f29d5978186e860029a4';

export const POW_9 = 10n ** 9n;

export const testnetClient = new SuiClient({ url: getFullnodeUrl('testnet') });

export const aclTestnet = makeMemezAclSdk();

export const configTestnet = new ConfigSDK();

export const memezPumpTestnet = new MemezPumpSDK();

export const memezStableTestnet = new MemezStableSDK();

export const executeTx = async (tx: Transaction, client = testnetClient) => {
  const result = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
    options: { showEffects: true },
  });

  // return if the tx hasn't succeed
  if (result.effects?.status?.status !== 'success') {
    console.log('\n\nTX failed');
    return;
  }

  console.log('SUCCESS!');

  if (result.effects.created) {
    log(result.effects.created);
  }
};

export const log = (x: unknown) =>
  console.log(util.inspect(x, false, null, true));

export const sleep = async (ms = 0) =>
  new Promise((resolve) => setTimeout(resolve, ms));
