import {
  executeTx,
  memezStableTestnet,
  TEST_STABLE_POOL_ID,
} from '../../utils.script';

(async () => {
  const { tx } = await memezStableTestnet.distributeStakeHoldersAllocation({
    pool: TEST_STABLE_POOL_ID,
  });

  await executeTx(tx);
})();
