import { getEnv, keypair, TEST_POOL_ID } from '../../utils.script';

const TOKEN_ID =
  '0xd2f226f40ea1783ecdef44bf8bcfca372a467d3a0469c3d14d8cb712f08ef210';

(async () => {
  const { pumpSdk, executeTx } = await getEnv();

  const { memeCoin, tx } = await pumpSdk.toCoin({
    pool: TEST_POOL_ID,
    memeToken: TOKEN_ID,
  });

  tx.transferObjects([memeCoin], tx.pure.address(keypair.toSuiAddress()));

  await executeTx(tx);
})();
