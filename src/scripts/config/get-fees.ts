import { CONFIG_KEYS } from '../../memez';
import { log, memezPumpTestnet } from '../utils.script';

(async () => {
  const fees = await memezPumpTestnet.getFees({
    configurationKey: CONFIG_KEYS.testnet.DEFAULT,
  });

  log(fees);
})();
