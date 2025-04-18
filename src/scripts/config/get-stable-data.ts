import { SUI_TYPE_ARG } from '@mysten/sui/utils';

import { CONFIG_KEYS } from '../../memez';
import { log, memezPumpTestnet } from '../utils.script';

(async () => {
  const stableData = await memezPumpTestnet.getStableData({
    configurationKey: CONFIG_KEYS.DEFAULT,
    totalSupply: 1e9 * 1e9,
    quoteCoinType: SUI_TYPE_ARG,
  });

  log(stableData);
})();
