import { coinWithBalance, Transaction } from '@mysten/sui/transactions';

import { getEnv, keypair, TEST_STABLE_POOL_ID } from '../../utils.script';
(async () => {
  const tx = new Transaction();

  const { stableSdk, executeTx } = await getEnv();

  const pool = await stableSdk.getStablePool(TEST_STABLE_POOL_ID);

  const memeCoin = coinWithBalance({
    balance: 1_000_000_000n,
    type: pool.memeCoinType,
  })(tx);

  const { quoteCoin, tx: tx2 } = await stableSdk.dump({
    pool: TEST_STABLE_POOL_ID,
    memeCoin,
    tx,
  });

  tx2.transferObjects([quoteCoin], keypair.toSuiAddress());

  await executeTx(tx2);
})();
