import { SUI_TYPE_ARG } from '@mysten/sui/utils';

import { CONFIG_KEYS, OWNED_OBJECTS } from '../../memez';
import { configTestnet, executeTx } from '../utils.script';
const configurationKey = CONFIG_KEYS.RECRD;

(async () => {
  const { tx, authWitness } = configTestnet.signIn({
    admin: OWNED_OBJECTS.ADMIN,
  });

  const tx2 = configTestnet.setPump({
    authWitness,
    tx,
    configurationKey,
    // Burn Tax
    // Virtual liquidity
    // Target liquidity
    // liquidity provision
    values: [0, 5_000_000_000, 3_000_000_000, 0],
    quoteCoinType: SUI_TYPE_ARG,
  });

  await executeTx(tx2);
})();
