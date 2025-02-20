import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction, TransactionResult } from '@mysten/sui/transactions';
import dotenv from 'dotenv';
import invariant from 'tiny-invariant';
import util from 'util';

import { AclSDK } from '../memez/acl';
import { ConfigSDK } from '../memez/config';
import { MemezFunSDK } from '../memez/memez';

dotenv.config();

invariant(process.env.KEY, 'Private key missing');

export const keypair = Ed25519Keypair.fromSecretKey(
  Uint8Array.from(Buffer.from(process.env.KEY, 'base64')).slice(1)
);

export const TEST_POOL_ID =
  '0xa1dca6c8f8883d9f5eeaf567c35768b2591cf45454c9e09b1be4be5949425ea7';

export const POW_9 = 10n ** 9n;

export const testnetClient = new SuiClient({ url: getFullnodeUrl('testnet') });

export const aclTestnet = new AclSDK();

export const configTestnet = new ConfigSDK();

export const memezTestnet = new MemezFunSDK();

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

export function removeLeadingZeros(address: string): string {
  return (address as any).replaceAll(/0x0+/g, '0x');
}

interface GetCoinOfValueArgs {
  tx: Transaction;
  coinType: string;
  coinValue: bigint;
  client?: SuiClient;
}

export async function getCoinOfValue({
  tx,
  coinType,
  coinValue,
  client = testnetClient,
}: GetCoinOfValueArgs): Promise<TransactionResult> {
  let coinOfValue: TransactionResult;
  coinType = removeLeadingZeros(coinType);
  if (coinType === '0x2::sui::SUI') {
    coinOfValue = tx.splitCoins(tx.gas, [tx.pure.u64(coinValue)]);
  } else {
    const paginatedCoins = await client.getCoins({
      owner: keypair.toSuiAddress(),
      coinType,
    });

    const [firstCoin, ...otherCoins] = paginatedCoins.data;

    const firstCoinInput = tx.object(firstCoin.coinObjectId);

    if (otherCoins.length > 0) {
      tx.mergeCoins(
        firstCoinInput,
        otherCoins.map((coin) => coin.coinObjectId)
      );
    }
    coinOfValue = tx.splitCoins(firstCoinInput, [tx.pure.u64(coinValue)]);
  }
  return coinOfValue;
}
