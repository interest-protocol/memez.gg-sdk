import { normalizeSuiAddress } from '@mysten/sui/utils';

import { CONFIG_KEYS, OWNED_OBJECTS, Treasuries } from '../../memez';
import { configTestnet, executeTx } from '../utils.script';

const ownedObjects = OWNED_OBJECTS.testnet;
const configurationKey = CONFIG_KEYS.testnet.RECRD;

(async () => {
  const { tx, authWitness } = configTestnet.signIn({
    admin: ownedObjects.ADMIN,
  });

  const memezTreasury = normalizeSuiAddress(Treasuries.MEMEZ);
  const recrdTreasury = normalizeSuiAddress(Treasuries.RECRD);

  const tx2 = configTestnet.setFees({
    authWitness,
    tx,
    configurationKey,
    values: [
      // last index is the creator fee nominal
      [3334n, 6666n, 0n],
      // last index is the swap fee in bps
      [5_000n, 2_500n, 2_500n, 100n],
      // last index is the migration fee nominal
      [1_000n, 4_000n, 2_500n, 2_500n, 500n],
      [3334n, 3333n, 3333n, 300n],
      [0n, 0n, 0n],
    ],
    recipients: [
      [memezTreasury, recrdTreasury],
      [recrdTreasury],
      [memezTreasury, recrdTreasury],
      [recrdTreasury],
    ],
  });

  await executeTx(tx2);
})();
