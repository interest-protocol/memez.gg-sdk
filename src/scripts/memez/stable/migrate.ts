import { getEnv, TEST_STABLE_POOL_ID } from '../../utils.script';

(async () => {
  const { stableSdk, executeTx, migratorSdk } = await getEnv();

  const { tx, migrator } = await stableSdk.migrate({
    pool: TEST_STABLE_POOL_ID,
  });

  const pool = await stableSdk.getStablePool(TEST_STABLE_POOL_ID);

  const { tx: tx2 } = migratorSdk.migrate({
    tx,
    migrator,
    memeCoinType: pool.memeCoinType,
    quoteCoinType: pool.quoteCoinType,
  });

  await executeTx(tx2);
})();
