import { Transaction } from '@mysten/sui/transactions';

import { getEnv, POW_9, TEST_POOL_ID } from '../../utils.script';

(async () => {
  const tx = new Transaction();

  const quoteCoin = tx.splitCoins(tx.gas, [tx.pure.u64(10n * POW_9)]);

  const { pumpSdk, executeTx } = await getEnv();

  const { memeToken, tx: tx2 } = await pumpSdk.pumpToken({
    pool: TEST_POOL_ID,
    quoteCoin,
    tx,
  });

  const pool = await pumpSdk.getPumpPool(TEST_POOL_ID);

  const { tx: tx3 } = await pumpSdk.keepToken({
    token: memeToken,
    tx: tx2,
    memeCoinType: pool.memeCoinType,
  });

  await executeTx(tx3);
})();
