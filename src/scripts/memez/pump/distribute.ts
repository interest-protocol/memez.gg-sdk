import { executeTx, memezPumpTestnet, TEST_POOL_ID } from '../../utils.script';
(async () => {
  const { tx } = await memezPumpTestnet.distributeStakeHoldersAllocation({
    pool: TEST_POOL_ID,
  });

  await executeTx(tx);
})();
