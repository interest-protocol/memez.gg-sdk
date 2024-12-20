import { CONFIG_KEYS } from '../../memez';
import { log, memezTestnet } from '../utils.script';

(async () => {
  const pumpData = await memezTestnet.getPumpData({
    configurationKey: CONFIG_KEYS.testnet.DEFAULT,
    totalSupply: 1e9 * 1e9,
  });

  log(pumpData);
})();
