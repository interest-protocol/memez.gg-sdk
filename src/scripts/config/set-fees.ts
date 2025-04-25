import { normalizeSuiAddress } from '@mysten/sui/utils';

import { CONFIG_KEYS, OWNED_OBJECTS, Treasuries } from '../../memez';
import { aclTestnet, configTestnet, executeTx } from '../utils.script';

const configurationKey = CONFIG_KEYS.MEMEZ;

(async () => {
  const { tx, authWitness } = aclTestnet.signIn({
    admin: OWNED_OBJECTS.ADMIN,
  });

  const memezTreasury = normalizeSuiAddress(Treasuries.MEMEZ);

  const tx2 = configTestnet.setFees({
    authWitness,
    tx,
    configurationKey,
    values: [
      // last index is the creator fee nominal
      [10_000, 0n],
      // last index is the swap fee in bps
      [10_000n, 0n],
      [10_000n, 25n],
      // last index is the migration fee nominal
      [10_000n, 50n],
      // Allow values
      [10_000n, 0n],
      // Vesting period
      [0n],
    ],
    recipients: [
      [memezTreasury],
      [memezTreasury],
      [memezTreasury],
      [memezTreasury],
    ],
  });

  await executeTx(tx2);
})();
