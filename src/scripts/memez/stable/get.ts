import { getEnv, TEST_STABLE_POOL_ID } from '../../utils.script';

(async () => {
  const { stableSdk, log } = await getEnv();

  const r = await stableSdk.getStablePool(TEST_STABLE_POOL_ID);

  log(r);
})();
