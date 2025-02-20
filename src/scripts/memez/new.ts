import { Transaction } from '@mysten/sui/transactions';
import { SUI_TYPE_ARG } from '@mysten/sui/utils';

import { CONFIG_KEYS, MIGRATOR_WITNESSES } from '../../memez';
import { executeTx, keypair, memezTestnet } from '../utils.script';

const configurationKey = CONFIG_KEYS.testnet.DEFAULT;

const TREASURY_CAP =
  '0x208d94a982b23b74876c70da1bb67eca260c9a44053710d0f309129adc315cdd';

const TOTAL_SUPPLY = 1_000_000_000_000_000_000n;

(async () => {
  const recipient = keypair.toSuiAddress();
  const tx = new Transaction();
  const [creationSuiFee, devPurchase] = tx.splitCoins(tx.gas, [
    tx.pure.u64(30_000_000n),
    tx.pure.u64(1_000_000_000n),
  ]);
  const { tx: tx2, metadataCap } = await memezTestnet.newPumpPool({
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
    useTokenStandard: false,
    quoteCoinType: SUI_TYPE_ARG,
  });
  tx.transferObjects([metadataCap], tx.pure.address(recipient));
  await executeTx(tx2);
})();
