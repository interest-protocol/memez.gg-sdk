import { getMemeCoinMarketCap } from '../../../memez/utils';
import { getEnv, TEST_POOL_ID } from '../../utils.script';

(async () => {
  const { pumpSdk, log } = await getEnv();

  const r = await pumpSdk.getPumpPool(TEST_POOL_ID);

  const marketCap = await getMemeCoinMarketCap({
    quoteBalance: r.curveState.quoteBalance,
    virtualLiquidity: r.curveState.virtualLiquidity,
    memeBalance: r.curveState.memeBalance,
    quoteUSDPrice: 5,
  });

  log(marketCap);
})();
