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
