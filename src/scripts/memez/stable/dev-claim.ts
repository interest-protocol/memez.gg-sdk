import {
  executeTx,
  keypair,
  memezStableTestnet,
  TEST_STABLE_POOL_ID,
} from '../../utils.script';
(async () => {
  const { memezVesting, tx } =
    await memezStableTestnet.developerAllocationClaim({
      pool: TEST_STABLE_POOL_ID,
    });

  tx.transferObjects([memezVesting], keypair.toSuiAddress());

  await executeTx(tx);
})();
