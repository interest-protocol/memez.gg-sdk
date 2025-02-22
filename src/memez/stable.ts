import { Transaction } from '@mysten/sui/transactions';
import {
  isValidSuiAddress,
  isValidSuiObjectId,
  normalizeStructTag,
} from '@mysten/sui/utils';
import invariant from 'tiny-invariant';

import { SDK } from './sdk';
import { SdkConstructorArgs } from './types/memez.types';
import {
  DumpArgs,
  DumpTokenArgs,
  NewStablePoolArgs,
  PumpArgs,
  PumpTokenArgs,
} from './types/stable.types';

export class MemezStableSDK extends SDK {
  /**
   * Initiates the MemezFun SDK.
   *
   * @param args - An object containing the necessary arguments to initialize the SDK.
   * @param args.fullNodeUrl - The full node URL to use for the SDK.
   * @param args.packages - The package addresses to use for the SDK.
   * @param args.sharedObjects - A record of shared objects to use for the SDK.
   * @param args.network - The network to use for the SDK. Either `mainnet` or `testnet`.
   */
  constructor(args: SdkConstructorArgs | undefined | null = null) {
    super(args);
  }

  public async newPool({
    tx = new Transaction(),
    configurationKey,
    migrationWitness,
    stakeHolders = [],
    quoteCoinType,
    developer,
    developerAllocation = 0n,
    vestingDurationMs = 0n,
    memeCoinTreasuryCap,
    creationSuiFee = this.zeroSuiCoin(tx),
    targetQuoteLiquidity,
    totalSupply = this.defaultSupply,
    useTokenStandard = false,
    metadata = {},
  }: NewStablePoolArgs) {
    invariant(BigInt(totalSupply) > 0n, 'totalSupply must be greater than 0');
    invariant(
      isValidSuiAddress(developer),
      'developer must be a valid Sui address'
    );

    invariant(
      stakeHolders.every((stakeHolder) => isValidSuiAddress(stakeHolder)),
      'stakeHolders must be a valid Sui address'
    );

    const { memeCoinType, coinMetadataId } =
      await this.getCoinMetadataAndType(memeCoinTreasuryCap);

    const memezMetadata = tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.METADATA,
      function: 'new',
      arguments: [
        tx.object(coinMetadataId),
        tx.pure.vector('string', Object.keys(metadata)),
        tx.pure.vector('string', Object.values(metadata)),
      ],
      typeArguments: [normalizeStructTag(memeCoinType)],
    });

    const metadataCap = tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.STABLE,
      function: 'new',
      arguments: [
        tx.sharedObjectRef(this.sharedObjects.CONFIG({ mutable: false })),
        tx.sharedObjectRef(
          this.sharedObjects.MIGRATOR_LIST({ mutable: false })
        ),
        this.ownedObject(tx, memeCoinTreasuryCap),
        this.ownedObject(tx, creationSuiFee),
        tx.pure.u64(targetQuoteLiquidity),
        tx.pure.u64(totalSupply),
        tx.pure.bool(useTokenStandard),
        memezMetadata,
        tx.pure.vector('u64', [developerAllocation, vestingDurationMs]),
        tx.pure.vector('address', stakeHolders),
        tx.pure.address(developer),
        this.getVersion(tx),
      ],
      typeArguments: [
        normalizeStructTag(memeCoinType),
        normalizeStructTag(quoteCoinType),
        normalizeStructTag(configurationKey),
        normalizeStructTag(migrationWitness),
      ],
    });

    return {
      metadataCap,
      tx,
    };
  }

  public async pump({ tx = new Transaction(), pool, quoteCoin }: PumpArgs) {
    if (typeof pool === 'string') {
      invariant(
        isValidSuiObjectId(pool),
        'pool must be a valid Sui objectId or MemezPool'
      );
      pool = await this.getStablePool(pool);
    }

    invariant(!pool.usesTokenStandard, 'pool uses token standard');

    const [excessQuoteCoin, memeCoin] = tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.STABLE,
      function: 'pump',
      arguments: [
        tx.object(pool.objectId),
        this.ownedObject(tx, quoteCoin),
        this.getVersion(tx),
      ],
      typeArguments: [pool.memeCoinType, pool.quoteCoinType],
    });

    return {
      excessQuoteCoin,
      memeCoin,
      tx,
    };
  }

  public async dump({ tx = new Transaction(), pool, memeCoin }: DumpArgs) {
    if (typeof pool === 'string') {
      invariant(
        isValidSuiObjectId(pool),
        'pool must be a valid Sui objectId or MemezPool'
      );
      pool = await this.getStablePool(pool);
    }

    invariant(!pool.usesTokenStandard, 'pool uses token standard');

    const quoteCoin = tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.STABLE,
      function: 'dump',
      arguments: [
        tx.object(pool.objectId),
        this.ownedObject(tx, memeCoin),
        this.getVersion(tx),
      ],
      typeArguments: [pool.memeCoinType, pool.quoteCoinType],
    });

    return {
      quoteCoin,
      tx,
    };
  }

  public async pumpToken({
    tx = new Transaction(),
    pool,
    quoteCoin,
  }: PumpTokenArgs) {
    if (typeof pool === 'string') {
      invariant(
        isValidSuiObjectId(pool),
        'pool must be a valid Sui objectId or MemezPool'
      );
      pool = await this.getStablePool(pool);
    }

    invariant(pool.usesTokenStandard, 'pool does not use token standard');

    const [excessQuoteCoin, memeToken] = tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.STABLE,
      function: 'pump_token',
      arguments: [
        tx.object(pool.objectId),
        this.ownedObject(tx, quoteCoin),
        this.getVersion(tx),
      ],
      typeArguments: [pool.memeCoinType, pool.quoteCoinType],
    });

    return {
      excessQuoteCoin,
      memeToken,
      tx,
    };
  }

  public async dumpToken({
    tx = new Transaction(),
    pool,
    memeToken,
  }: DumpTokenArgs) {
    if (typeof pool === 'string') {
      invariant(
        isValidSuiObjectId(pool),
        'pool must be a valid Sui objectId or MemezPool'
      );
      pool = await this.getStablePool(pool);
    }

    invariant(pool.usesTokenStandard, 'pool does not use token standard');

    const quoteCoin = tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.STABLE,
      function: 'dump_token',
      arguments: [
        tx.object(pool.objectId),
        this.ownedObject(tx, memeToken),
        this.getVersion(tx),
      ],
      typeArguments: [pool.memeCoinType, pool.quoteCoinType],
    });

    return {
      quoteCoin,
      tx,
    };
  }
}
