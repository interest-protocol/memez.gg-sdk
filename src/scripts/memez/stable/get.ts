import {
  log,
  memezStableTestnet,
  TEST_STABLE_POOL_ID,
} from '../../utils.script';

(async () => {
  const r = await memezStableTestnet.getStablePool(TEST_STABLE_POOL_ID);

  log(r);
})();
