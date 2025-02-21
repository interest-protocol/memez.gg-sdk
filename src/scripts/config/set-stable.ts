import { SUI_TYPE_ARG } from '@mysten/sui/utils';

import { CONFIG_KEYS, MAX_BPS, OWNED_OBJECTS } from '../../memez';
import { configTestnet, executeTx, POW_9 } from '../utils.script';

const ownedObjects = OWNED_OBJECTS.testnet;
const configurationKey = CONFIG_KEYS.testnet.DEFAULT;

(async () => {
  const { tx, authWitness } = configTestnet.signIn({
    admin: ownedObjects.ADMIN,
  });

  const tx2 = configTestnet.setStable({
    authWitness,
    tx,
    configurationKey,
    // Burn Tax
    // Virtual liquidity
    // Target liquidity
    // liquidity provision
    values: [100_000_000n * POW_9, MAX_BPS / 20n, 3000n],
    quoteCoinType: SUI_TYPE_ARG,
  });

  await executeTx(tx2);
})();
