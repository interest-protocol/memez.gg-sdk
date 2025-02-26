import { log, memezPumpTestnet, TEST_POOL_ID } from '../utils.script';

(async () => {
  const pool = await memezPumpTestnet.getPumpPool(TEST_POOL_ID);

  const r = await memezPumpTestnet.getPoolMetadata({
    poolId: TEST_POOL_ID,
    quoteCoinType: pool.quoteCoinType,
    memeCoinType: pool.memeCoinType,
    curveType: pool.curveType,
  });

  log(r);
})();
