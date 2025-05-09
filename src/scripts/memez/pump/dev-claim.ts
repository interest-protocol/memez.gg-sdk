import { getEnv, keypair, TEST_POOL_ID } from '../../utils.script';

(async () => {
  const { pumpSdk, executeTx } = await getEnv();

  const { memeCoin, tx } = await pumpSdk.devClaim({
    pool: TEST_POOL_ID,
  });

  tx.transferObjects([memeCoin], keypair.toSuiAddress());

  await executeTx(tx);
})();
