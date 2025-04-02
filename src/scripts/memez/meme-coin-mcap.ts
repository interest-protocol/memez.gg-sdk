import { getMemeCoinMarketCap } from '../../memez/utils';
import { log, memezPumpTestnet, TEST_POOL_ID } from '../utils.script';
(async () => {
  const r = await memezPumpTestnet.getPumpPool(TEST_POOL_ID);

  const marketCap = await getMemeCoinMarketCap({
    quoteBalance: r.curveState.quoteBalance,
    virtualLiquidity: r.curveState.virtualLiquidity,
    memeBalance: r.curveState.memeBalance,
    quoteUSDPrice: 5,
  });

  log(marketCap);
})();
