import { MigratorSDK } from '../../memez/migrator';
import { executeTx, memezTestnet, TEST_POOL_ID } from '../utils.script';

(async () => {
  const { tx, migrator } = await memezTestnet.migrate({
    pool: TEST_POOL_ID,
  });

  const pool = await memezTestnet.getPumpPool(TEST_POOL_ID);

  const migratorSDK = new MigratorSDK();

  const { tx: tx2 } = migratorSDK.migrate({
    tx,
    migrator,
    memeCoinType: pool.memeCoinType,
    quoteCoinType: pool.quoteCoinType,
  });

  await executeTx(tx2);
})();
