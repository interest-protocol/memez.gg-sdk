import { getEnv, TEST_POOL_ID } from '../../utils.script';

(async () => {
  const { pumpSdk, migratorSdk, executeTx } = await getEnv();

  const { tx, migrator } = await pumpSdk.migrate({
    pool: TEST_POOL_ID,
  });

  const pool = await pumpSdk.getPumpPool(TEST_POOL_ID);

  const { tx: tx2 } = migratorSdk.migrate({
    tx,
    migrator,
    memeCoinType: pool.memeCoinType,
    quoteCoinType: pool.quoteCoinType,
  });

  await executeTx(tx2);
})();
