import { getEnv, TEST_STABLE_POOL_ID } from '../../utils.script';

(async () => {
  const { stableSdk, executeTx } = await getEnv();

  const { tx } = await stableSdk.distributeStakeHoldersAllocation({
    pool: TEST_STABLE_POOL_ID,
  });

  await executeTx(tx);
})();
