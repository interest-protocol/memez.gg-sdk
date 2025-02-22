import { Transaction } from '@mysten/sui/transactions';
import { SUI_TYPE_ARG } from '@mysten/sui/utils';

import { CONFIG_KEYS, MIGRATOR_WITNESSES } from '../../../memez';
import { executeTx, keypair, memezStableTestnet } from '../../utils.script';

const configurationKey = CONFIG_KEYS.testnet.DEFAULT;

const TREASURY_CAP =
  '0x973594e084b411a62335182111ab252dc7fa274444f7ad64b2c267903d64a8d4';

const TOTAL_SUPPLY = 1_000_000_000_000_000_000n;

(async () => {
  const recipient = keypair.toSuiAddress();

  const tx = new Transaction();

  const creationSuiFee = tx.splitCoins(tx.gas, [tx.pure.u64(30_000_000n)]);

  const { tx: tx2, metadataCap } = await memezStableTestnet.newPool({
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
    migrationWitness: MIGRATOR_WITNESSES.testnet.TEST,
    targetQuoteLiquidity: 3n * 1_000_000_000n,
    totalSupply: TOTAL_SUPPLY,
    useTokenStandard: true,
    quoteCoinType: SUI_TYPE_ARG,
    developer: recipient,
    developerAllocation: TOTAL_SUPPLY / 100n,
    vestingDurationMs: 1000n,
  });

  tx.transferObjects([metadataCap], tx.pure.address(recipient));

  await executeTx(tx2);
})();
