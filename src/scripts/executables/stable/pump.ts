import { Transaction } from '@mysten/sui/transactions';

import {
  getEnv,
  keypair,
  POW_9,
  TEST_STABLE_POOL_ID,
} from '../../utils.script';

(async () => {
  const { stableSdk, executeTx } = await getEnv();

  const tx = new Transaction();

  const quoteCoin = tx.splitCoins(tx.gas, [tx.pure.u64(5n * POW_9)]);

  const {
    memeCoin,
    excessQuoteCoin,
    tx: tx2,
  } = await stableSdk.pump({
    pool: TEST_STABLE_POOL_ID,
    quoteCoin,
    tx,
  });

  tx2.transferObjects([memeCoin, excessQuoteCoin], keypair.toSuiAddress());

  await executeTx(tx2);
})();
