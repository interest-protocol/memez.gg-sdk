import { getEnv, TEST_POOL_ID } from '../../utils.script';

(async () => {
  const { pumpSdk, executeTx } = await getEnv();

  const { tx } = await pumpSdk.distributeStakeHoldersAllocation({
    pool: TEST_POOL_ID,
  });

  await executeTx(tx);
})();
