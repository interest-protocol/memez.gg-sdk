import {
  executeTx,
  keypair,
  memezStableTestnet,
  TEST_STABLE_POOL_ID,
} from '../../utils.script';

const TOKEN_ID = '';

(async () => {
  const { memeCoin, tx } = await memezStableTestnet.toCoin({
    pool: TEST_STABLE_POOL_ID,
    memeToken: TOKEN_ID,
  });

  tx.transferObjects([memeCoin], tx.pure.address(keypair.toSuiAddress()));

  await executeTx(tx);
})();
