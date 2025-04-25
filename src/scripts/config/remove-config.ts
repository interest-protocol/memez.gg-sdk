import { CONFIG_KEYS, OWNED_OBJECTS, PACKAGES, TYPES } from '../../memez';
import { aclTestnet, configTestnet, executeTx } from '../utils.script';

(async () => {
  const { tx, authWitness } = aclTestnet.signIn({
    admin: OWNED_OBJECTS.ADMIN,
  });

  const tx2 = configTestnet.removeConfiguration({
    authWitness,
    key: `${PACKAGES.MEMEZ_FUN.original}::memez_config::FeesKey<${CONFIG_KEYS.MEMEZ}>`,
    model: TYPES.MEMEZ_FEE,
    tx,
  });

  await executeTx(tx2);
})();
