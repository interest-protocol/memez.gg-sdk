import {
  executeTx,
  keypair,
  memezStableTestnet,
  TEST_STABLE_POOL_ID,
} from '../../utils.script';

const TOKEN_ID =
  '0xa5bb7c5d48e7bb8662ed9bd52b7a332c2e26e4e5df87eaa0829c51d234867afd';

(async () => {
  const { memeCoin, tx } = await memezStableTestnet.toCoin({
    pool: TEST_STABLE_POOL_ID,
    memeToken: TOKEN_ID,
  });

  tx.transferObjects([memeCoin], tx.pure.address(keypair.toSuiAddress()));

  await executeTx(tx);
})();
