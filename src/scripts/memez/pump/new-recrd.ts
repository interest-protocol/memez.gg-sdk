import { Transaction } from '@mysten/sui/transactions';
import { normalizeSuiAddress, SUI_TYPE_ARG } from '@mysten/sui/utils';

import { CONFIG_KEYS, MIGRATOR_WITNESSES } from '../../../memez';
import { executeTx, keypair, memezPumpTestnet } from '../../utils.script';

const configurationKey = CONFIG_KEYS.testnet.RECRD;

const TREASURY_CAP =
  '0xa665dfa8aa5f8e33ec7c282b4d78fd302709bb9ab31638f9e12188f4620d52e5';

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
      videoUrl:
        'https://www.recrd.com/discover?post_id=b91e3ea0-e1b5-11ec-8a3e-57bff316ee8e',
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
    stakeHolders: [normalizeSuiAddress('0x2'), normalizeSuiAddress('0x3')],
  });
  tx.transferObjects([metadataCap], tx.pure.address(recipient));
  await executeTx(tx2);
})();
