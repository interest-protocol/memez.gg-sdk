import { Transaction } from '@mysten/sui/transactions';

import { CONFIG_KEYS, MIGRATOR_WITNESSES } from '../../memez';
import { executeTx, keypair, memezTestnet } from '../utils.script';
const configurationKey = CONFIG_KEYS.testnet.RECRD;

const TREASURY_CAP =
  '0xc4915a41540f0ff3a0a785b0706d69f5457f624c239e022060b7f27cdbc5036e';

const TOTAL_SUPPLY = 1_000_000_000_000_000_000n;

(async () => {
  const recipient = keypair.toSuiAddress();
  const tx = new Transaction();
  const creationSuiFee = tx.splitCoins(tx.gas, [tx.pure.u64(30_000_000n)]);
  const { tx: tx2, metadataCap } = await memezTestnet.newPumpPool({
    tx,
    configurationKey,
    metadata: {
      X: 'https://x.com/Meme',
      Website: 'https://meme.xyz/',
      GitHub: 'https://github.com/meme',
      videoUrl: 'https://www.recrd.com/id=123',
    },
    creationSuiFee,
    memeCoinTreasuryCap: TREASURY_CAP,
    migrationWitness: MIGRATOR_WITNESSES.testnet.TEST,
    totalSupply: TOTAL_SUPPLY,
    useTokenStandard: false,
    stakeHolders: [recipient, recipient],
  });
  tx.transferObjects([metadataCap], tx.pure.address(recipient));
  await executeTx(tx2);
})();
