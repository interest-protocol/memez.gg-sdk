import { MIGRATOR_WITNESSES, OWNED_OBJECTS } from '../../memez';
import { configTestnet, executeTx } from '../utils.script';

const migratorWitness = MIGRATOR_WITNESSES.TEST;

(async () => {
  const { tx, authWitness } = configTestnet.signIn({
    admin: OWNED_OBJECTS.ADMIN,
  });

  const tx2 = configTestnet.addMigrationWitness({
    authWitness,
    witness: migratorWitness,
    tx,
  });

  await executeTx(tx2);
})();
