import { getEnv, keypair, TEST_STABLE_POOL_ID } from '../../utils.script';

const TOKEN_ID = '';

(async () => {
  const { stableSdk, executeTx } = await getEnv();

  const { memeCoin, tx } = await stableSdk.toCoin({
    pool: TEST_STABLE_POOL_ID,
    memeToken: TOKEN_ID,
  });

  tx.transferObjects([memeCoin], tx.pure.address(keypair.toSuiAddress()));

  await executeTx(tx);
})();
