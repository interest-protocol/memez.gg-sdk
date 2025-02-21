import { ObjectRef } from '@mysten/sui/transactions';

import {
  ConfigKey,
  MaybeTx,
  MemezPool,
  MigratorWitness,
  ObjectInput,
  PumpState,
  StructTag,
  U64,
} from './memez.types';

export interface DevPurchaseData {
  developer: string;
  firstPurchase: ObjectInput;
}

export interface NewPumpPoolArgs extends MaybeTx {
  memeCoinTreasuryCap: string | ObjectRef;
  creationSuiFee?: ObjectInput;
  totalSupply?: U64;
  useTokenStandard?: boolean;
  devPurchaseData?: DevPurchaseData;
  metadata?: Record<string, string>;
  configurationKey: ConfigKey;
  migrationWitness: MigratorWitness;
  stakeHolders?: string[];
  quoteCoinType: string | StructTag;
}

export interface PumpArgs extends MaybeTx {
  pool: string | MemezPool<PumpState>;
  suiCoin: ObjectInput;
  minAmountOut?: U64;
}

export interface PumpTokenArgs extends MaybeTx {
  pool: string | MemezPool<PumpState>;
  suiCoin: ObjectInput;
  minAmountOut?: U64;
}

export interface DumpTokenArgs extends MaybeTx {
  pool: string | MemezPool<PumpState>;
  memeToken: ObjectInput;
  minAmountOut?: U64;
}

export interface DumpArgs extends MaybeTx {
  pool: string | MemezPool<PumpState>;
  memeCoin: ObjectInput;
  minAmountOut?: U64;
}

export interface QuoteArgs {
  pool: string | MemezPool<PumpState>;
  amount: U64;
}

export interface QuotePumpReturnValues {
  amountOut: bigint;
  swapFeeIn: bigint;
}

export interface QuoteDumpReturnValues {
  amountOut: bigint;
  swapFeeIn: bigint;
  burnFee: bigint;
}

export interface DistributeStakeHoldersAllocationArgs extends MaybeTx {
  pool: string | MemezPool<PumpState>;
}
