import {
  memezStableTestnet,
  POW_9,
  TEST_STABLE_POOL_ID,
} from '../../utils.script';

(async () => {
  const x = await memezStableTestnet.quotePump({
    pool: TEST_STABLE_POOL_ID,
    amount: 20n * POW_9,
  });
  console.log(x);
})();
