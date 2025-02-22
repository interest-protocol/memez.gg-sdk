import { Transaction } from '@mysten/sui/transactions';

import {
  executeTx,
  keypair,
  memezStableTestnet,
  TEST_STABLE_POOL_ID,
} from '../../utils.script';

(async () => {
  const tx = new Transaction();

  const { quoteCoin, tx: tx2 } = await memezStableTestnet.dumpToken({
    pool: TEST_STABLE_POOL_ID,
    memeToken:
      '0x499dd0e10b9ec1e9530dbdade1b27bfac99afd8b4914c714d5a469f85959aa68',
    tx,
  });

  tx2.transferObjects([quoteCoin], tx.pure.address(keypair.toSuiAddress()));

  await executeTx(tx2);
})();
