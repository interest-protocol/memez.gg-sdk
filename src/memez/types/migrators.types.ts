import { TransactionResult } from '@mysten/sui/transactions';

import { MaybeTx, U64 } from './memez.types';

export interface RecrdSetRewardValueArgs extends MaybeTx {
  rewardValue: U64;
}

export interface RecrdSetTreasuryArgs extends MaybeTx {
  treasury: string;
}

export interface RecrdSetInitializePriceArgs extends MaybeTx {
  price: U64;
}

export interface RecrdRegisterPoolArgs extends MaybeTx {
  memeCoinTreasuryCap: string;
}

export interface RecrdMigrateArgs extends MaybeTx {
  migrator: TransactionResult;
  memeCoinType: string;
  quoteCoinType: string;
  ipxMemeCoinTreasury: string;
}
