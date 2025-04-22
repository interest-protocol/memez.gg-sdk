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

  const quoteCoin = tx.splitCoins(tx.gas, [tx.pure.u64(5n * POW_9)]);

  const {
    memeCoin,
    excessQuoteCoin,
    tx: tx2,
  } = await memezStableTestnet.pump({
    pool: TEST_STABLE_POOL_ID,
    quoteCoin,
    tx,
  });

  tx2.transferObjects([memeCoin, excessQuoteCoin], keypair.toSuiAddress());

  await executeTx(tx2);
})();
