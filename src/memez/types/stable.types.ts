import { ObjectRef } from '@mysten/sui/transactions';

import {
  ConfigKey,
  MaybeTx,
  MemezPool,
  MigratorWitness,
  ObjectInput,
  StableState,
  StructTag,
  U64,
} from './memez.types';

export interface NewStablePoolArgs extends MaybeTx {
  memeCoinTreasuryCap: string | ObjectRef;
  creationSuiFee?: ObjectInput;
  targetQuoteLiquidity: U64;
  totalSupply?: U64;
  useTokenStandard?: boolean;
  metadata?: Record<string, string>;
  configurationKey: ConfigKey;
  migrationWitness: MigratorWitness;
  stakeHolders?: string[];
  quoteCoinType: string | StructTag;
  developer: string;
  developerAllocation: U64;
  vestingDurationMs: U64;
}

export interface PumpArgs extends MaybeTx {
  pool: string | MemezPool<StableState>;
  quoteCoin: ObjectInput;
}

export interface PumpTokenArgs extends MaybeTx {
  pool: string | MemezPool<StableState>;
  quoteCoin: ObjectInput;
}

export interface DumpTokenArgs extends MaybeTx {
  pool: string | MemezPool<StableState>;
  memeToken: ObjectInput;
}

export interface DumpArgs extends MaybeTx {
  pool: string | MemezPool<StableState>;
  memeCoin: ObjectInput;
}
