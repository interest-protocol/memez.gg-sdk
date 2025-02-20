import { normalizeSuiAddress } from '@mysten/sui/utils';

import { CONFIG_KEYS, MAX_BPS, OWNED_OBJECTS, Treasuries } from '../../memez';
import { configTestnet, executeTx } from '../utils.script';

const ownedObjects = OWNED_OBJECTS.testnet;
const configurationKey = CONFIG_KEYS.testnet.DEFAULT;

(async () => {
  const { tx, authWitness } = configTestnet.signIn({
    admin: ownedObjects.ADMIN,
  });

  const memezTreasury = normalizeSuiAddress(Treasuries.MEMEZ);

  const tx2 = configTestnet.setFees({
    authWitness,
    tx,
    configurationKey,
    values: [
      // last index is the creator fee nominal
      [MAX_BPS, 30_000_000n],
      // last index is the swap fee in bps
      [MAX_BPS, 30n],
      // last index is the migration fee nominal
      [MAX_BPS, 100n],
      // last index is the allocation of meme coin in BPS
      // The [last_index - 1] is the vesting period in MS
      [MAX_BPS, 0, 0],
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
