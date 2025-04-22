import { Transaction } from '@mysten/sui/transactions';
import { SUI_TYPE_ARG } from '@mysten/sui/utils';

import { CONFIG_KEYS, MIGRATOR_WITNESSES } from '../../../memez';
import { executeTx, keypair, memezStableTestnet } from '../../utils.script';

const configurationKey = CONFIG_KEYS.MEMEZ;

const TREASURY_CAP =
  '0x35174e97103b320b0f259a7e6e81a2384f04135acce52f3483bce52d7a25cb0a';

const TOTAL_SUPPLY = 1_000_000_000_000_000_000n;

(async () => {
  const recipient = keypair.toSuiAddress();

  const tx = new Transaction();

  const { tx: tx2, metadataCap } = await memezStableTestnet.newPool({
    tx,
    configurationKey,
    metadata: {
      X: 'https://x.com/Meme',
      Website: 'https://meme.xyz/',
      GitHub: 'https://github.com/meme',
      videoUrl: 'https://memez.gg',
    },
    memeCoinTreasuryCap: TREASURY_CAP,
    migrationWitness: MIGRATOR_WITNESSES.TEST,
    targetQuoteLiquidity: 3n * 1_000_000_000n,
    totalSupply: TOTAL_SUPPLY,
    liquidityProvision: 10_000 / 20,
    memeSalePercentage: 3000,
    useTokenStandard: false,
    quoteCoinType: SUI_TYPE_ARG,
    developer: recipient,
    developerAllocation: TOTAL_SUPPLY / 100n,
    vestingDurationMs: 1000n,
  });

  tx.transferObjects([metadataCap], tx.pure.address(recipient));

  await executeTx(tx2);
})();
