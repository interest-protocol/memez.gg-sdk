import { Transaction } from '@mysten/sui/transactions';

import {
  executeTx,
  keypair,
  memezPumpTestnet,
  TEST_POOL_ID,
} from '../../utils.script';

(async () => {
  const tx = new Transaction();

  const { suiCoin, tx: tx2 } = await memezPumpTestnet.dumpToken({
    pool: TEST_POOL_ID,
    memeToken:
      '0x6a83f8b244cd07851e3e7b1a9c42e07beba876828e077c5c31d8c9968fb46ada',
    tx,
  });

  tx2.transferObjects([suiCoin], tx.pure.address(keypair.toSuiAddress()));

  await executeTx(tx2);
})();
