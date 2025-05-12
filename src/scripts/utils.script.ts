import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import dotenv from 'dotenv';
import invariant from 'tiny-invariant';
import util from 'util';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import {
  CONFIG_KEYS,
  MIGRATOR_WITNESSES,
  OWNED_OBJECTS,
  PACKAGES,
  SHARED_OBJECTS,
  TYPES,
} from '../memez';
import { makeMemezAclSdk } from '../memez/acl';
import { ConfigSDK } from '../memez/config';
import { Network } from '../memez/constants';
import { RecrdMigratorSDK, TestMigratorSDK } from '../memez/migrators';
import { MemezPumpSDK } from '../memez/pump';
import { MemezStableSDK } from '../memez/stable';

dotenv.config();

invariant(process.env.KEY, 'Private key missing');

export const keypair = Ed25519Keypair.fromSecretKey(
  Uint8Array.from(Buffer.from(process.env.KEY, 'base64')).slice(1)
);

export const TEST_POOL_ID =
  '0xbc0fb2558938521434dd528427e9585c420af83b44277b325fe8a2987c897b15';

export const TEST_STABLE_POOL_ID =
  '0xf53fd73af2d033c1c8d82a385ce983b6d24d0c722cf564317d85fbecdeb833b0';

export const POW_9 = 10n ** 9n;

const log = (x: unknown) => console.log(util.inspect(x, false, null, true));

const sleep = async (ms = 0) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const recrdMigratorSdk = new RecrdMigratorSDK();

export const getEnv = async () => {
  const argv = await yargs(hideBin(process.argv))
    .option('network', {
      alias: 'n',
      type: 'string',
      description: 'Specify the network',
    })
    .parse();

  const network =
    argv.network === 'mainnet' ? Network.MAINNET : Network.TESTNET;

  const payload = {
    network,
    fullNodeUrl: getFullnodeUrl(network),
  };

  const suiClient = new SuiClient({ url: payload.fullNodeUrl });

  const executeTx = async (tx: Transaction, client = suiClient) => {
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

  return {
    aclSdk: makeMemezAclSdk(payload),
    configSdk: new ConfigSDK(payload),
    pumpSdk: new MemezPumpSDK(payload),
    stableSdk: new MemezStableSDK(payload),
    testMigratorSdk: new TestMigratorSDK(payload),
    suiClient,
    executeTx,
    network,
    log,
    sleep,
    migratorWitnesses: MIGRATOR_WITNESSES[network],
    ownedObjects: OWNED_OBJECTS[network],
    sharedObjects: SHARED_OBJECTS[network],
    types: TYPES[network],
    configKeys: CONFIG_KEYS[network],
    packages: PACKAGES[network],
    keypair,
  };
};
