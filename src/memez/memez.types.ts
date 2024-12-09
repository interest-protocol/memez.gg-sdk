import {
  CallArg,
  Transaction,
  TransactionObjectArgument,
} from '@mysten/sui/transactions';

import type {
  CONFIG_KEYS,
  CONFIG_MODELS,
  MIGRATOR_WITNESSES,
} from './constants';

export type ObjectInput = TransactionObjectArgument | string;

type U64 = string | bigint | number;

export enum Network {
  Mainnet = 'mainnet',
  Testnet = 'testnet',
}

export interface MaybeTx {
  tx?: Transaction;
}

export type Package = Record<
  'MEMEZ_FUN' | 'MEMEZ_MIGRATOR' | 'ACL' | 'VESTING',
  string
>;

export type SharedObject = Extract<
  CallArg,
  {
    Object: unknown;
  }
>;

export interface ShareObjectValueMap {
  IMMUT: SharedObject;
  MUT: SharedObject;
}

export type MemezFunSharedObjects = Record<
  'ACL' | 'MIGRATOR_LIST' | 'VERSION' | 'CONFIG',
  ShareObjectValueMap
>;

export type OwnedObjects = Record<
  | 'SUPER_ADMIN'
  | 'ACL_UPGRADE_CAP'
  | 'VESTING_UPGRADE_CAP'
  | 'MEMEZ_FUN_UPGRADE_CAP'
  | 'MEMEZ_MIGRATOR_UPGRADE_CAP'
  | 'ADMIN',
  string
>;

export interface SignInArgs extends MaybeTx {
  admin: ObjectInput;
}

export interface SdkConstructorArgs {
  fullNodeUrl?: string;
  packages?: Package;
  sharedObjects?: MemezFunSharedObjects;
  network?: Network;
}

export type ConfigKey =
  (typeof CONFIG_KEYS)[Network][keyof (typeof CONFIG_KEYS)[Network]];

export type MigratorWitness =
  (typeof MIGRATOR_WITNESSES)[Network][keyof (typeof MIGRATOR_WITNESSES)[Network]];

export type ConfigModel =
  (typeof CONFIG_MODELS)[Network][keyof (typeof CONFIG_MODELS)[Network]];

export interface NewPumpPoolArgs extends MaybeTx {
  memeCoinTreasuryCap: ObjectInput;
  creationSuiFee?: ObjectInput;
  totalSupply?: U64;
  useTokenStandard?: boolean;
  firstPurchase?: ObjectInput;
  metadata?: Record<string, string>;
  developer: string;
  configurationKey: ConfigKey;
  migrationWitness: MigratorWitness;
  memeCoinType: string;
}

export interface PumpArgs extends MaybeTx {
  pool: string | MemezPool<PumpState>;
  suiCoin: ObjectInput;
  minAmountOut?: U64;
}

export interface DumpArgs extends MaybeTx {
  pool: string | MemezPool<PumpState>;
  memeCoin: ObjectInput;
  minAmountOut?: U64;
}

export interface MemezPool<T> {
  objectId: string;
  poolType: string;
  curveType: string;
  memeCoinType: string;
  useTokenStandard: boolean;
  ipxMemeCoinTreasury: string;
  metadata: Record<string, string>;
  migrationWitness: string;
  progress: string;
  stateId: string;
  dynamicFieldDataId: string;
  curveState: T;
}

export interface PumpState {
  devPurchase: bigint;
  liquidityProvision: bigint;
  migrationFee: bigint;
  virtualLiquidity: bigint;
  targetSuiLiquidity: bigint;
  suiBalance: bigint;
  memeBalance: bigint;
  burnTax: number;
  swapFee: number;
}

export type PumpPool = MemezPool<PumpState>;

export interface NewAdminArgs extends MaybeTx {
  superAdmin: ObjectInput;
}

export interface NewAdminAndTransferArgs extends MaybeTx {
  superAdmin: ObjectInput;
  recipient: string;
}

export interface RevokeAdminArgs extends MaybeTx {
  superAdmin: ObjectInput;
  admin: string;
}

export interface DestroyAdminArgs extends MaybeTx {
  admin: ObjectInput;
}

export interface DestroySuperAdminArgs extends MaybeTx {
  superAdmin: ObjectInput;
}

export interface StartSuperAdminTransferArgs extends MaybeTx {
  superAdmin: ObjectInput;
  recipient: string;
}

export interface FinishSuperAdminTransferArgs extends MaybeTx {
  superAdmin: ObjectInput;
}

export interface IsAdminArgs {
  admin: string;
}

export interface AddMigrationWitnessArgs extends MaybeTx {
  authWitness: ObjectInput;
  witness: MigratorWitness;
}

export interface RemoveMigrationWitnessArgs extends MaybeTx {
  authWitness: ObjectInput;
  witness: MigratorWitness;
}

export interface SetFeesArgs extends MaybeTx {
  authWitness: ObjectInput;
  configurationKey: ConfigKey;
  values: U64[][];
  recipient: string[][];
}

export interface SetAuctionArgs extends MaybeTx {
  authWitness: ObjectInput;
  configurationKey: ConfigKey;
  values: U64[];
}

export interface SetPumpArgs extends MaybeTx {
  authWitness: ObjectInput;
  configurationKey: ConfigKey;
  values: U64[];
}

export interface SetStableArgs extends MaybeTx {
  authWitness: ObjectInput;
  configurationKey: ConfigKey;
  values: U64[];
}

export interface RemoveConfigurationArgs extends MaybeTx {
  configurationKey: ConfigKey;
  model: ConfigModel;
  authWitness: ObjectInput;
}
