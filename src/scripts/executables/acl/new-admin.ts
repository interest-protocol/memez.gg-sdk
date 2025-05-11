import { getEnv, keypair } from '../../utils.script';

(async () => {
  const recipient = keypair.toSuiAddress();

  const { aclSdk, executeTx, ownedObjects } = await getEnv();

  const tx = aclSdk.newAdminAndTransfer({
    superAdmin: ownedObjects.MEMEZ_SUPER_ADMIN,
    recipient,
  });

  await executeTx(tx);
})();
