import { CONFIG_KEYS, MIGRATOR_WITNESSES, OWNED_OBJECTS } from '../../memez';
import { configTestnet, executeTx } from '../utils.script';

const migratorWitness = MIGRATOR_WITNESSES.TEST;

(async () => {
  const { tx, authWitness } = configTestnet.signIn({
    admin: OWNED_OBJECTS.ADMIN,
  });

  const tx2 = configTestnet.removeMigrationWitness({
    authWitness,
    configKey: CONFIG_KEYS.MEMEZ,
    migratorWitness,
    tx,
  });

  await executeTx(tx2);
})();
