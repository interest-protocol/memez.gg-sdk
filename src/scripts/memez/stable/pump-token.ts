import { Transaction } from '@mysten/sui/transactions';

import {
  executeTx,
  keypair,
  memezStableTestnet,
  POW_9,
  TEST_STABLE_POOL_ID,
} from '../../utils.script';

(async () => {
  const tx = new Transaction();

  const quoteCoin = tx.splitCoins(tx.gas, [tx.pure.u64(10n * POW_9)]);

  const {
    memeToken,
    tx: tx2,
    excessQuoteCoin,
  } = await memezStableTestnet.pumpToken({
    pool: TEST_STABLE_POOL_ID,
    quoteCoin,
    tx,
  });

  tx2.transferObjects(
    [excessQuoteCoin],
    tx2.pure.address(keypair.toSuiAddress())
  );

  const pool = await memezStableTestnet.getStablePool(TEST_STABLE_POOL_ID);

  const { tx: tx3 } = await memezStableTestnet.keepToken({
    token: memeToken,
    tx: tx2,
    memeCoinType: pool.memeCoinType,
  });

  await executeTx(tx3);
})();
