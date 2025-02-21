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

  const suiCoin = tx.splitCoins(tx.gas, [tx.pure.u64(3n * POW_9)]);

  const { memeCoin, tx: tx2 } = await memezPumpTestnet.pump({
    pool: TEST_POOL_ID,
    suiCoin,
    tx,
  });

  tx2.transferObjects([memeCoin], keypair.toSuiAddress());

  await executeTx(tx2);
})();
