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
      '0x0e7ff43271a5e8bd96cfc0907b514490cc9a22cfca9d9029bd16d5669ce6800a',
    tx,
  });

  tx2.transferObjects([suiCoin], tx.pure.address(keypair.toSuiAddress()));

  await executeTx(tx2);
})();
