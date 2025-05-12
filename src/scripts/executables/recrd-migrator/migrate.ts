import invariant from 'tiny-invariant';

import { getEnv, recrdMigratorSdk, TEST_POOL_ID } from '../../utils.script';

(async () => {
  const { executeTx, network, pumpSdk, keypair } = await getEnv();

  invariant(network === 'mainnet', 'Only mainnet is supported');

  const pool = await pumpSdk.getPumpPool(TEST_POOL_ID);

  const { tx, migrator } = await pumpSdk.migrate({
    pool: TEST_POOL_ID,
  });

  const { tx: tx2, suiCoin } = await recrdMigratorSdk.migrate({
    tx,
    migrator,
    memeCoinType: pool.memeCoinType,
    quoteCoinType: pool.quoteCoinType,
    ipxMemeCoinTreasury: pool.ipxMemeCoinTreasury,
  });

  tx2.transferObjects([suiCoin], keypair.toSuiAddress());

  await executeTx(tx2);
})();
