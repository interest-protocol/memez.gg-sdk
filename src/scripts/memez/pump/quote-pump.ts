import { memezPumpTestnet, POW_9, TEST_POOL_ID } from '../../utils.script';

(async () => {
  const { memeAmountOut, swapFeeIn } = await memezPumpTestnet.quotePump({
    pool: TEST_POOL_ID,
    amount: 15n * POW_9,
  });
  console.log({ memeAmountOut, swapFeeIn });
})();
