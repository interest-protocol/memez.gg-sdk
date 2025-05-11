import { getEnv, TEST_POOL_ID } from '../../utils.script';

(async () => {
  const { pumpSdk, log } = await getEnv();

  const pool = await pumpSdk.getPumpPool(TEST_POOL_ID);

  const r = await pumpSdk.getPoolMetadata({
    poolId: TEST_POOL_ID,
    quoteCoinType: pool.quoteCoinType,
    memeCoinType: pool.memeCoinType,
    curveType: pool.curveType,
  });

  log(r);
})();
