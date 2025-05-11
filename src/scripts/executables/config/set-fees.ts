import { normalizeSuiAddress } from '@mysten/sui/utils';

import { Treasuries } from '../../../memez';
import { getEnv } from '../../utils.script';

(async () => {
  const { aclSdk, configSdk, executeTx, ownedObjects, configKeys } =
    await getEnv();

  const { tx, authWitness } = aclSdk.signIn({
    admin: ownedObjects.ADMIN,
  });

  const memezTreasury = normalizeSuiAddress(Treasuries.MEMEZ);
  const recrdTreasury = normalizeSuiAddress(Treasuries.RECRD);

  const tx2 = configSdk.setFees({
    authWitness,
    tx,
    configurationKey: configKeys.MEMEZ,
    values: [
      // last index is the creator fee nominal
      [10_000, 0n],
      // last index is the swap fee in bps
      [5_000n, 2_500n, 2_500n, 100n],
      [5_000n, 2_500n, 2_500n, 100n],
      // last index is the migration fee bps
      [4_000n, 1_000n, 2_500n, 2_500n, 500n],
      // Allow values
      [3_334n, 3_333n, 3_333n, 300n],
      // Vesting period
      [0n],
    ],
    recipients: [
      [memezTreasury],
      [recrdTreasury],
      [recrdTreasury, memezTreasury],
      [recrdTreasury],
    ],
  });

  await executeTx(tx2);
})();
