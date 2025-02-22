import { Transaction } from '@mysten/sui/transactions';

import {
  executeTx,
  getCoinOfValue,
  keypair,
  memezPumpTestnet,
  TEST_POOL_ID,
} from '../../utils.script';
(async () => {
  const tx = new Transaction();

  const pool = await memezPumpTestnet.getPumpPool(TEST_POOL_ID);

  const memeCoin = await getCoinOfValue({
    tx,
    coinType: pool.memeCoinType,
    coinValue: 1_000_000_000n,
  });

  const { quoteCoin, tx: tx2 } = await memezPumpTestnet.dump({
    pool: TEST_POOL_ID,
    memeCoin,
    tx,
  });

  tx2.transferObjects([quoteCoin], keypair.toSuiAddress());

  await executeTx(tx2);
})();
