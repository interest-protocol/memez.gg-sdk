import { SUI_TYPE_ARG } from '@mysten/sui/utils';

import { CONFIG_KEYS, MAX_BPS, OWNED_OBJECTS } from '../../memez';
import { configTestnet, executeTx, POW_9 } from '../utils.script';

const configurationKey = CONFIG_KEYS.DEFAULT;

(async () => {
  const { tx, authWitness } = configTestnet.signIn({
    admin: OWNED_OBJECTS.ADMIN,
  });

  const tx2 = configTestnet.setStable({
    authWitness,
    tx,
    configurationKey,
    // Nominal Value of Max Target Quote Liquidity
    // Percentage of meme coin liquidity provision
    // Percentage of meme amount to sell
    values: [100_000_000n * POW_9, MAX_BPS / 20n, 3000n],
    quoteCoinType: SUI_TYPE_ARG,
  });

  await executeTx(tx2);
})();
