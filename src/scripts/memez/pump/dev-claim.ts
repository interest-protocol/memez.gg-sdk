import {
  executeTx,
  keypair,
  memezPumpTestnet,
  TEST_POOL_ID,
} from '../../utils.script';
(async () => {
  const { memeCoin, tx } = await memezPumpTestnet.devClaim({
    pool: TEST_POOL_ID,
  });

  tx.transferObjects([memeCoin], keypair.toSuiAddress());

  await executeTx(tx);
})();
