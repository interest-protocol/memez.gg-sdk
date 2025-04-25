import { Transaction } from '@mysten/sui/transactions';
import { SUI_TYPE_ARG } from '@mysten/sui/utils';

import { CONFIG_KEYS, MIGRATOR_WITNESSES } from '../../../memez';
import { executeTx, keypair, memezPumpTestnet } from '../../utils.script';

const configurationKey = CONFIG_KEYS.MEMEZ;

const TREASURY_CAP =
  '0xc29dbdbd868203d967e932113604eccedc507f63c8ce7c33e248d22bd4cd15c0';

const TOTAL_SUPPLY = 1_000_000_000_000_000_000n;

(async () => {
  const recipient = keypair.toSuiAddress();
  const tx = new Transaction();

  const { tx: tx2, metadataCap } = await memezPumpTestnet.newPool({
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
    totalSupply: TOTAL_SUPPLY,
    useTokenStandard: false,
    quoteCoinType: SUI_TYPE_ARG,
    burnTax: 0,
    virtualLiquidity: 5_000_000_000,
    targetQuoteLiquidity: 3_000_000_000,
    liquidityProvision: 0,
  });

  tx.transferObjects([metadataCap], tx.pure.address(recipient));

  const result = await executeTx(tx2);

  console.log(result);
})();
