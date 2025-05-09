import { getEnv, keypair, TEST_STABLE_POOL_ID } from '../../utils.script';

(async () => {
  const { stableSdk, executeTx } = await getEnv();

  const { memezVesting, tx } = await stableSdk.developerAllocationClaim({
    pool: TEST_STABLE_POOL_ID,
  });

  tx.transferObjects([memezVesting], keypair.toSuiAddress());

  await executeTx(tx);
})();
