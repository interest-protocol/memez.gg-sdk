import {
  ObjectRef,
  Transaction,
  TransactionObjectArgument,
  TransactionResult,
} from '@mysten/sui/transactions';

import type {
  CONFIG_KEYS,
  CONFIG_MODELS,
  MIGRATOR_WITNESSES,
} from '../constants';
import type { SHARED_OBJECTS } from '../constants';

export type ObjectInput = TransactionObjectArgument | string | ObjectRef;

export type U64 = string | bigint | number;

export enum Network {
  Mainnet = 'mainnet',
  Testnet = 'testnet',
}

export type StructTag = {
  address: string;
  module: string;
  name: string;
  typeParams: (string | StructTag)[];
};

export interface MaybeTx {
  tx?: Transaction;
}

export interface PackageValues {
  original: string;
  latest: string;
}

export type Package = Record<
  'MEMEZ_FUN' | 'MEMEZ_MIGRATOR' | 'ACL' | 'VESTING' | 'MEMEZ_WITNESS',
  PackageValues & Record<string, string>
>;

export type MemezFunSharedObjects = (typeof SHARED_OBJECTS)[Network];

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

export interface MemezPool<T> {
  objectId: string;
  poolType: string;
  curveType: string;
  memeCoinType: string;
  quoteCoinType: string;
  usesTokenStandard: boolean;
  ipxMemeCoinTreasury: string;
  metadata: Record<string, string>;
  migrationWitness: string;
  progress: string;
  stateId: string;
  dynamicFieldDataId: string;
  curveState: T;
}

export interface Recipient {
  address: string;
  bps: number;
}

export interface Allocation {
  memeBalance: bigint;
  vestingPeriod: bigint;
  recipients: Recipient[];
}

export interface PumpState {
  devPurchase: bigint;
  liquidityProvision: bigint;
  migrationFee: number;
  virtualLiquidity: bigint;
  targetQuoteLiquidity: bigint;
  quoteBalance: bigint;
  memeBalance: bigint;
  burnTax: number;
  swapFee: number;
  allocation: Allocation;
}

export interface StableState {
  memeReserve: bigint;
  developerAllocation: bigint;
  developerVestingPeriod: bigint;
  memeLiquidityProvision: bigint;
  migrationFee: number;
  quoteRaiseAmount: bigint;
  memeSaleAmount: bigint;
  swapFee: number;
  memeBalance: bigint;
  quoteBalance: bigint;
  allocation: Allocation;
}

export type PumpPool = MemezPool<PumpState>;

export type StablePool = MemezPool<StableState>;

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
  recipients: string[][];
}

export interface SetAuctionArgs extends MaybeTx {
  authWitness: ObjectInput;
  configurationKey: ConfigKey;
  quoteCoinType: string | StructTag;
  values: U64[];
}

export interface SetPumpArgs extends MaybeTx {
  authWitness: ObjectInput;
  configurationKey: ConfigKey;
  quoteCoinType: string | StructTag;
  values: U64[];
}

export interface SetStableArgs extends MaybeTx {
  authWitness: ObjectInput;
  configurationKey: ConfigKey;
  quoteCoinType: string | StructTag;
  values: U64[];
}

export interface RemoveConfigurationArgs extends MaybeTx {
  configurationKey: ConfigKey;
  model: ConfigModel;
  authWitness: ObjectInput;
}

export interface DevClaimArgs extends MaybeTx {
  pool: string | MemezPool<PumpState>;
}

export interface MigrateArgs extends MaybeTx {
  pool: string | MemezPool<PumpState>;
}

export interface MigratorMigrateArgs extends MaybeTx {
  migrator: TransactionResult;
  memeCoinType: string;
  quoteCoinType: string;
}

export interface KeepTokenArgs extends MaybeTx {
  memeCoinType: string;
  token: ObjectInput;
}

export interface GetFeesArgs {
  configurationKey: ConfigKey;
}

export interface GetCurveDataArgs {
  configurationKey: ConfigKey;
  totalSupply: U64;
  quoteCoinType: string | StructTag;
}

export interface StableData {
  maxTargetQuoteLiquidity: bigint;
  liquidityProvision: bigint;
  memeSaleAmount: bigint;
}

export interface PumpData {
  burnTax: bigint;
  virtualLiquidity: bigint;
  targetQuoteLiquidity: bigint;
  liquidityProvision: bigint;
}

export interface GetMemeCoinMarketCapArgs {
  quoteBalance: bigint;
  virtualLiquidity: bigint;
  memeBalance: bigint;
  quoteUSDCPrice: number;
  memeCoinTotalSupply?: bigint;
}

export interface GetPoolMetadataArgs {
  poolId: string;
  quoteCoinType: string | StructTag;
  memeCoinType: string | StructTag;
  curveType: string | StructTag;
}
