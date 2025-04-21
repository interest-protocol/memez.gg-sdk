import { OWNED_OBJECTS } from '../../memez';
import { aclTestnet, executeTx, keypair } from '../utils.script';

(async () => {
  const recipient = keypair.toSuiAddress();

  const tx = aclTestnet.newAdminAndTransfer({
    superAdmin: OWNED_OBJECTS.MEMEZ_SUPER_ADMIN,
    recipient,
  });

  await executeTx(tx);
})();
