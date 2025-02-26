import { Transaction } from '@mysten/sui/transactions';
import { SUI_TYPE_ARG } from '@mysten/sui/utils';

import { CONFIG_KEYS, MIGRATOR_WITNESSES } from '../../../memez';
import { executeTx, keypair, memezPumpTestnet } from '../../utils.script';

const configurationKey = CONFIG_KEYS.testnet.DEFAULT;

const TREASURY_CAP =
  '0x9745a47275872b52136973a5d8b760d97e2712ed883098eba036931209584006';

const TOTAL_SUPPLY = 1_000_000_000_000_000_000n;

(async () => {
  const recipient = keypair.toSuiAddress();
  const tx = new Transaction();
  const [creationSuiFee, devPurchase] = tx.splitCoins(tx.gas, [
    tx.pure.u64(30_000_000n),
    tx.pure.u64(1_000_000_000n),
  ]);
  const { tx: tx2, metadataCap } = await memezPumpTestnet.newPool({
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
    migrationWitness: MIGRATOR_WITNESSES.testnet.TEST,
    totalSupply: TOTAL_SUPPLY,
    useTokenStandard: true,
    quoteCoinType: SUI_TYPE_ARG,
  });
  tx.transferObjects([metadataCap], tx.pure.address(recipient));
  await executeTx(tx2);
})();
