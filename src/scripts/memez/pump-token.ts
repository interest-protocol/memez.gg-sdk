import { Transaction } from '@mysten/sui/transactions';

import { executeTx, memezTestnet, POW_9, TEST_POOL_ID } from '../utils.script';

(async () => {
  const tx = new Transaction();

  const suiCoin = tx.splitCoins(tx.gas, [tx.pure.u64(3n * POW_9)]);

  const { memeToken, tx: tx2 } = await memezTestnet.pumpToken({
    pool: TEST_POOL_ID,
    suiCoin,
    tx,
  });

  const pool = await memezTestnet.getPumpPool(TEST_POOL_ID);

  const { tx: tx3 } = await memezTestnet.keepToken({
    token: memeToken,
    tx: tx2,
    memeCoinType: pool.memeCoinType,
  });

  await executeTx(tx3);
})();
