import { Transaction } from '@mysten/sui/transactions';
import { SUI_TYPE_ARG } from '@mysten/sui/utils';

import { CONFIG_KEYS, MIGRATOR_WITNESSES } from '../../../memez';
import { executeTx, keypair, memezPumpTestnet } from '../../utils.script';

const configurationKey = CONFIG_KEYS.NEXA;

const TREASURY_CAP =
  '0x0a9de7f42bd24819f43bb0479a918235b3f7c5c82b49370a232634e9c911c7e8';

const TOTAL_SUPPLY = 1_000_000_000_000_000_000n;

(async () => {
  const recipient = keypair.toSuiAddress();
  const tx = new Transaction();
  const [creationSuiFee, devPurchase] = tx.splitCoins(tx.gas, [
    tx.pure.u64(30_000_000n),
    tx.pure.u64(1_000_000_000n),
  ]);
  const { tx: tx2, metadataCap } = await memezPumpTestnet.newPoolWithConfig({
    tx,
    configurationKey,
    metadata: {
      X: 'https://x.com/Meme',
      Website: 'https://meme.xyz/',
      GitHub: 'https://github.com/meme',
      videoUrl: 'https://memez.gg',
    },
    creationSuiFee,
    memeCoinTreasuryCap: TREASURY_CAP,
    devPurchaseData: {
      developer: recipient,
      firstPurchase: devPurchase,
    },
    migrationWitness: MIGRATOR_WITNESSES.TEST,
    totalSupply: TOTAL_SUPPLY,
    useTokenStandard: false,
    quoteCoinType: SUI_TYPE_ARG,
    burnTax: 0,
    virtualLiquidity: 5_000_000_000,
    targetQuoteLiquidity: 3_000_000_000,
    liquidityProvision: 0,
  });
  tx.transferObjects([metadataCap], tx.pure.address(recipient));
  await executeTx(tx2);
})();
