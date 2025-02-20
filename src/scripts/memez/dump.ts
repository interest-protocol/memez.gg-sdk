import { Transaction } from '@mysten/sui/transactions';

import {
  executeTx,
  getCoinOfValue,
  keypair,
  memezTestnet,
  TEST_POOL_ID,
} from '../utils.script';
(async () => {
  const tx = new Transaction();

  const pool = await memezTestnet.getPumpPool(TEST_POOL_ID);

  const memeCoin = await getCoinOfValue({
    tx,
    coinType: pool.memeCoinType,
    coinValue: 1_000_000_000n,
  });

  const { suiCoin, tx: tx2 } = await memezTestnet.dump({
    pool: TEST_POOL_ID,
    memeCoin,
    tx,
  });

  tx2.transferObjects([suiCoin], keypair.toSuiAddress());

  await executeTx(tx2);
})();
