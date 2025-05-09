import { Transaction } from '@mysten/sui/transactions';

import { getEnv, keypair, TEST_STABLE_POOL_ID } from '../../utils.script';

(async () => {
  const tx = new Transaction();

  const { stableSdk, executeTx } = await getEnv();

  const { quoteCoin, tx: tx2 } = await stableSdk.dumpToken({
    pool: TEST_STABLE_POOL_ID,
    memeToken: '',
    tx,
  });

  tx2.transferObjects([quoteCoin], tx.pure.address(keypair.toSuiAddress()));

  await executeTx(tx2);
})();
