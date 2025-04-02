import { CONFIG_KEYS, OWNED_OBJECTS } from '../../memez';
import { configTestnet, executeTx } from '../utils.script';

const configurationKey = CONFIG_KEYS.NEXA;

(async () => {
  const { tx, authWitness } = configTestnet.signIn({
    admin: OWNED_OBJECTS.ADMIN,
  });

  const tx2 = configTestnet.allowCustomConfig({
    authWitness,
    tx,
    configurationKey,
  });

  await executeTx(tx2);
})();
