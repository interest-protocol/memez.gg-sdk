import { Transaction } from '@mysten/sui/transactions';
import { normalizeSuiAddress, SUI_TYPE_ARG } from '@mysten/sui/utils';

import { CONFIG_KEYS, MIGRATOR_WITNESSES } from '../../../memez';
import { executeTx, keypair, memezPumpTestnet } from '../../utils.script';

const configurationKey = CONFIG_KEYS.testnet.RECRD;

const TREASURY_CAP =
  '0xa4d76c2997ab675b9fabba82a37b05a67189da8a8d85d88a74787cf72ccea140';

const TOTAL_SUPPLY = 1_000_000_000_000_000_000n;

(async () => {
  const recipient = keypair.toSuiAddress();
  const tx = new Transaction();
  const creationSuiFee = tx.splitCoins(tx.gas, [tx.pure.u64(30_000_000n)]);
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
    migrationWitness: MIGRATOR_WITNESSES.testnet.TEST,
    totalSupply: TOTAL_SUPPLY,
    useTokenStandard: true,
    quoteCoinType: SUI_TYPE_ARG,
    stakeHolders: [normalizeSuiAddress('0x2'), normalizeSuiAddress('0x3')],
  });
  tx.transferObjects([metadataCap], tx.pure.address(recipient));
  await executeTx(tx2);
})();
