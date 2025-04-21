import { SUI_TYPE_ARG } from '@mysten/sui/utils';

import { CONFIG_KEYS, OWNED_OBJECTS } from '../../memez';
import { configTestnet, executeTx } from '../utils.script';

(async () => {
  const { tx, authWitness } = configTestnet.signIn({
    admin: OWNED_OBJECTS.ADMIN,
  });

  const tx2 = configTestnet.addQuoteCoin({
    authWitness,
    configKey: CONFIG_KEYS.MEMEZ,
    quoteCoinType: SUI_TYPE_ARG,
    tx,
  });

  await executeTx(tx2);
})();
