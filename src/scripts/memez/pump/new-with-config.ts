import { Transaction } from '@mysten/sui/transactions';
import { SUI_TYPE_ARG } from '@mysten/sui/utils';

import { CONFIG_KEYS, MIGRATOR_WITNESSES } from '../../../memez';
import { executeTx, keypair, memezPumpTestnet } from '../../utils.script';

const configurationKey = CONFIG_KEYS.NEXA;

const TREASURY_CAP =
  '0xcad74d3f16ed90631aedaa3b197b52051edd82684c23c510ed69b7e7c9c58aa3';

const TOTAL_SUPPLY = 1_000_000_000_000_000_000n;

(async () => {
  const recipient = keypair.toSuiAddress();
  const tx = new Transaction();

  const { tx: tx2, metadataCap } = await memezPumpTestnet.newPoolWithConfig({
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

  tx2.setSender(
    '0x4a81a450d6cbb3c373c80b542c20523f7eab8c39c346ef521c54526e61d2baa6'
  );

  const result = await executeTx(tx2);

  console.log(result);
})();
