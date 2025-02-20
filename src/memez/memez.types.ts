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
} from './constants';
import type { SHARED_OBJECTS } from './constants';

export type ObjectInput = TransactionObjectArgument | string | ObjectRef;

type U64 = string | bigint | number;

export enum Network {
  Mainnet = 'mainnet',
  Testnet = 'testnet',
}

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

export interface MemezPool<T> {
  objectId: string;
  poolType: string;
  curveType: string;
  memeCoinType: string;
  usesTokenStandard: boolean;
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
  recipients: string[][];
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

export interface DevClaimArgs extends MaybeTx {
  pool: string | MemezPool<PumpState>;
}

export interface MigrateArgs extends MaybeTx {
  pool: string | MemezPool<PumpState>;
}

export interface MigratorMigrateArgs extends MaybeTx {
  migrator: TransactionResult;
  memeCoinType: string;
}

export interface KeepTokenArgs extends MaybeTx {
  memeCoinType: string;
  token: ObjectInput;
}

export interface ToCoinArgs extends MaybeTx {
  pool: string | MemezPool<PumpState>;
  memeToken: ObjectInput;
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

export interface GetFeesArgs {
  configurationKey: ConfigKey;
}

export interface GetCurveDataArgs {
  configurationKey: ConfigKey;
  totalSupply: U64;
}

export interface PumpData {
  burnTax: bigint;
  virtualLiquidity: bigint;
  targetSuiLiquidity: bigint;
  liquidityProvision: bigint;
}

export interface GetMemeCoinMarketCapArgs {
  suiBalance: bigint;
  virtualLiquidity: bigint;
  memeBalance: bigint;
  suiUSDCPrice: number;
  memeCoinTotalSupply?: bigint;
}
