import {
  executeTx,
  keypair,
  memezTestnet,
  TEST_POOL_ID,
} from '../utils.script';

const TOKEN_ID =
  '0x2d51d2fd0e03cf8f79589e156d3d2d4b0529d8f1fb414aea20b5a1fe30c09b51';

(async () => {
  const { memeCoin, tx } = await memezTestnet.toCoin({
    pool: TEST_POOL_ID,
    memeToken: TOKEN_ID,
  });

  tx.transferObjects([memeCoin], tx.pure.address(keypair.toSuiAddress()));

  await executeTx(tx);
})();
