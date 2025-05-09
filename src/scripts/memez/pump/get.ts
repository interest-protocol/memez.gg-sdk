import { getEnv, TEST_POOL_ID } from '../../utils.script';

(async () => {
  const { pumpSdk, log } = await getEnv();

  const r = await pumpSdk.getPumpPool(TEST_POOL_ID);

  log(r);
})();
