import { CONFIG_KEYS, MIGRATOR_WITNESSES, OWNED_OBJECTS } from '../../memez';
import { aclTestnet, configTestnet, executeTx } from '../utils.script';

const migratorWitness = MIGRATOR_WITNESSES.TEST;

(async () => {
  const { tx, authWitness } = aclTestnet.signIn({
    admin: OWNED_OBJECTS.ADMIN,
  });

  const tx2 = configTestnet.addMigrationWitness({
    authWitness,
    configKey: CONFIG_KEYS.MEMEZ,
    migratorWitness,
    tx,
  });

  await executeTx(tx2);
})();
