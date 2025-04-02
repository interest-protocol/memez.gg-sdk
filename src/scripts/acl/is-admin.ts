import { OWNED_OBJECTS } from '../../memez';
import { aclTestnet } from '../utils.script';

(async () => {
  const result = await aclTestnet.isAdmin({
    admin: OWNED_OBJECTS.ADMIN,
  });

  console.log(result);
})();
