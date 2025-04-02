import { normalizeSuiAddress } from '@mysten/sui/utils';

import { CONFIG_KEYS, OWNED_OBJECTS, Treasuries } from '../../memez';
import { configTestnet, executeTx } from '../utils.script';

const configurationKey = CONFIG_KEYS.NEXA;

(async () => {
  const { tx, authWitness } = configTestnet.signIn({
    admin: OWNED_OBJECTS.ADMIN,
  });

  const memezTreasury = normalizeSuiAddress(Treasuries.MEMEZ);
  const nexaTreasury = normalizeSuiAddress('0x8');

  const tx2 = configTestnet.setFees({
    authWitness,
    tx,
    configurationKey,
    values: [
      // last index is the creator fee nominal
      [10_000, 0n],
      // last index is the swap fee in bps
      [10_000n, 25n],
      // last index is the migration fee nominal
      [6_000n, 4_000n, 50n],
      [10_000n, 0n],
      [0n, 0n, 0n],
    ],
    recipients: [
      [memezTreasury],
      [memezTreasury],
      [nexaTreasury, memezTreasury],
      [memezTreasury],
    ],
  });

  await executeTx(tx2);
})();
