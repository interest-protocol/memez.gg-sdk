import { coinWithBalance, Transaction } from '@mysten/sui/transactions';

import {
  executeTx,
  keypair,
  memezStableTestnet,
  TEST_STABLE_POOL_ID,
} from '../../utils.script';
(async () => {
  const tx = new Transaction();

  const pool = await memezStableTestnet.getStablePool(TEST_STABLE_POOL_ID);

  const memeCoin = coinWithBalance({
    balance: 1_000_000_000n,
    type: pool.memeCoinType,
  })(tx);

  const { quoteCoin, tx: tx2 } = await memezStableTestnet.dump({
    pool: TEST_STABLE_POOL_ID,
    memeCoin,
    tx,
  });

  tx2.transferObjects([quoteCoin], keypair.toSuiAddress());

  await executeTx(tx2);
})();
