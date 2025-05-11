import invariant from 'tiny-invariant';

import { Treasuries } from '../../../memez/constants';
import { getEnv, recrdMigratorSdk } from '../../utils.script';

(async () => {
  const { executeTx, network } = await getEnv();

  invariant(network === 'mainnet', 'Only mainnet is supported');

  const { tx } = recrdMigratorSdk.setTreasury({
    treasury: Treasuries.MEMEZ,
  });

  await executeTx(tx);
})();
