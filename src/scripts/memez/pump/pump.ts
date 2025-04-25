import { Transaction } from '@mysten/sui/transactions';

import {
  executeTx,
  keypair,
  memezPumpTestnet,
  POW_9,
  TEST_POOL_ID,
} from '../../utils.script';
(async () => {
  const tx = new Transaction();

  const quoteCoin = tx.splitCoins(tx.gas, [tx.pure.u64(5n * POW_9)]);

  const { memeCoin, tx: tx2 } = await memezPumpTestnet.pump({
    pool: TEST_POOL_ID,
    quoteCoin,
    tx,
  });

  tx2.transferObjects([memeCoin], keypair.toSuiAddress());

  await executeTx(tx2);
})();
