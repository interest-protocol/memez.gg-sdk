import { log, memezPumpTestnet, TEST_POOL_ID } from '../../utils.script';

(async () => {
  const r = await memezPumpTestnet.getPumpPool(TEST_POOL_ID);

  log(r);
})();
