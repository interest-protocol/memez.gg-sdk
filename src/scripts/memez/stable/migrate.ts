import { MigratorSDK } from '../../../memez/migrator';
import {
  executeTx,
  memezStableTestnet,
  TEST_STABLE_POOL_ID,
} from '../../utils.script';

(async () => {
  const { tx, migrator } = await memezStableTestnet.migrate({
    pool: TEST_STABLE_POOL_ID,
  });

  const pool = await memezStableTestnet.getStablePool(TEST_STABLE_POOL_ID);

  const migratorSDK = new MigratorSDK();

  const { tx: tx2 } = migratorSDK.migrate({
    tx,
    migrator,
    memeCoinType: pool.memeCoinType,
    quoteCoinType: pool.quoteCoinType,
  });

  await executeTx(tx2);
})();
