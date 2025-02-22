import { bcs } from '@mysten/sui/bcs';
import { Transaction } from '@mysten/sui/transactions';
import {
  isValidSuiAddress,
  isValidSuiObjectId,
  normalizeStructTag,
  normalizeSuiAddress,
} from '@mysten/sui/utils';
import { devInspectAndGetReturnValues } from '@polymedia/suitcase-core';
import invariant from 'tiny-invariant';

import { Progress } from './constants';
import { SDK } from './sdk';
import {
  DevClaimArgs,
  GetCurveDataArgs,
  MigrateArgs,
  PumpData,
  SdkConstructorArgs,
  StableData,
} from './types/memez.types';
import {
  DistributeStakeHoldersAllocationArgs,
  DumpArgs,
  DumpTokenArgs,
  NewPumpPoolArgs,
  PumpArgs,
  PumpTokenArgs,
  QuoteArgs,
  QuoteDumpReturnValues,
  QuotePumpReturnValues,
  ToCoinArgs,
} from './types/pump.types';
export class MemezPumpSDK extends SDK {
  /**
   * Initiates the MemezPump SDK.
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

  /**
   * Creates a new MemezPool using the Pump invariant.
   *
   * @param args - An object containing the necessary arguments to create a new MemezPool.
   * @param args.tx - Sui client Transaction class to chain move calls.
   * @param args.creationSuiFee - The Sui fee to use for the creation of the MemezPool.
   * @param args.memeCoinTreasuryCap - The meme coin treasury cap.
   * @param args.totalSupply - The total supply of the meme coin.
   * @param args.devPurchaseData - The developer purchase data object. It includes the developer address and the first purchase in Sui.
   * @param args.useTokenStandard - Whether to use the token standard for the MemezPool.
   * @param args.metadata - A record of social metadata of the meme coin.
   * @param args.configurationKey - The configuration key to use for the MemezPool.
   * @param args.migrationWitness - The migration witness to use for the MemezPool.
   * @param args.memeCoinType - The meme coin type to use for the MemezPool.
   * @param args.quote - The quote type of the meme coin.
   *
   * @returns An object containing the meme coin MetadataCap and the transaction.
   * @returns values.metadataCap - The meme coin MetadataCap.
   * @returns values.tx - The Transaction.
   */
  public async newPool({
    tx = new Transaction(),
    creationSuiFee = this.zeroSuiCoin(tx),
    memeCoinTreasuryCap,
    totalSupply = this.defaultSupply,
    useTokenStandard = false,
    devPurchaseData = {
      developer: normalizeSuiAddress('0x0'),
      firstPurchase: this.zeroSuiCoin(tx),
    },
    metadata = {},
    configurationKey,
    migrationWitness,
    stakeHolders = [],
    quoteCoinType,
  }: NewPumpPoolArgs) {
    const { developer, firstPurchase } = devPurchaseData;

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
      module: this.modules.PUMP,
      function: 'new',
      arguments: [
        tx.sharedObjectRef(this.sharedObjects.CONFIG({ mutable: false })),
        tx.sharedObjectRef(
          this.sharedObjects.MIGRATOR_LIST({ mutable: false })
        ),
        this.ownedObject(tx, memeCoinTreasuryCap),
        this.ownedObject(tx, creationSuiFee),
        tx.pure.u64(totalSupply),
        tx.pure.bool(useTokenStandard),
        this.ownedObject(tx, firstPurchase),
        memezMetadata,
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

  /**
   * Swaps Sui for the meme coin.
   *
   * @param args - An object containing the necessary arguments to pump the meme coin into the pool.
   * @param args.tx - Sui client Transaction class to chain move calls.
   * @param args.pool - The objectId of the MemezPool or the full parsed pool.
   * @param args.quoteCoin - The quote coin to sell for the meme coin.
   * @param args.minAmountOut - The minimum amount meme coin expected to be received.
   *
   * @returns An object containing the meme coin and the transaction.
   * @returns values.memeCoin - The meme coin.
   * @returns values.tx - The Transaction.
   */
  public async pump({
    tx = new Transaction(),
    pool,
    quoteCoin,
    minAmountOut = 0n,
  }: PumpArgs) {
    if (typeof pool === 'string') {
      invariant(
        isValidSuiObjectId(pool),
        'pool must be a valid Sui objectId or MemezPool'
      );
      pool = await this.getPumpPool(pool);
    }

    invariant(!pool.usesTokenStandard, 'pool uses token standard');

    const memeCoin = tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.PUMP,
      function: 'pump',
      arguments: [
        tx.object(pool.objectId),
        this.ownedObject(tx, quoteCoin),
        tx.pure.u64(minAmountOut),
        this.getVersion(tx),
      ],
      typeArguments: [pool.memeCoinType, pool.quoteCoinType],
    });

    return {
      memeCoin,
      tx,
    };
  }

  /**
   * Swaps Sui for the meme token using the Token Standard. This is for pools that use the Token Standard.
   *
   * @param args - An object containing the necessary arguments to pump the meme token into the pool.
   * @param args.tx - Sui client Transaction class to chain move calls.
   * @param args.pool - The objectId of the MemezPool or the full parsed pool.
   * @param args.quoteCoin - The quote coin to sell for the meme token.
   * @param args.minAmountOut - The minimum amount meme token expected to be received.
   *
   * @returns An object containing the meme token and the transaction.
   * @returns values.memeToken - The meme token.
   * @returns values.tx - The Transaction.
   */
  public async pumpToken({
    tx = new Transaction(),
    pool,
    quoteCoin,
    minAmountOut = 0n,
  }: PumpTokenArgs) {
    if (typeof pool === 'string') {
      invariant(
        isValidSuiObjectId(pool),
        'pool must be a valid Sui objectId or MemezPool'
      );
      pool = await this.getPumpPool(pool);
    }

    invariant(pool.usesTokenStandard, 'pool uses token standard');

    const memeToken = tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.PUMP,
      function: 'pump_token',
      arguments: [
        tx.object(pool.objectId),
        this.ownedObject(tx, quoteCoin),
        tx.pure.u64(minAmountOut),
        this.getVersion(tx),
      ],
      typeArguments: [pool.memeCoinType, pool.quoteCoinType],
    });

    return {
      memeToken,
      tx,
    };
  }

  /**
   * Swaps the meme coin for Sui.
   *
   * @param args - An object containing the necessary arguments to dump the meme coin into the pool.
   * @param args.tx - Sui client Transaction class to chain move calls.
   * @param args.pool - The objectId of the MemezPool or the full parsed pool.
   * @param args.memeCoin - The meme coin to sell for Sui.
   * @param args.minAmountOut - The minimum amount Sui expected to be received.
   *
   * @returns An object containing the Sui coin and the transaction.
   * @returns values.quoteCoin - The quote coin.
   * @returns values.tx - The Transaction.
   */
  public async dump({
    tx = new Transaction(),
    pool,
    memeCoin,
    minAmountOut = 0n,
  }: DumpArgs) {
    if (typeof pool === 'string') {
      invariant(
        isValidSuiObjectId(pool),
        'pool must be a valid Sui objectId or MemezPool'
      );
      pool = await this.getPumpPool(pool);
    }

    invariant(!pool.usesTokenStandard, 'pool uses token standard');

    const quoteCoin = tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.PUMP,
      function: 'dump',
      arguments: [
        tx.object(pool.objectId),
        tx.object(pool.ipxMemeCoinTreasury),
        this.ownedObject(tx, memeCoin),
        tx.pure.u64(minAmountOut),
        this.getVersion(tx),
      ],
      typeArguments: [pool.memeCoinType, pool.quoteCoinType],
    });

    return {
      quoteCoin,
      tx,
    };
  }

  /**
   * Swaps the meme token for Sui. This is for pools that use the Token Standard.
   *
   * @param args - An object containing the necessary arguments to dump the meme token into the pool.
   * @param args.tx - Sui client Transaction class to chain move calls.
   * @param args.pool - The objectId of the MemezPool or the full parsed pool.
   * @param args.memeToken - The meme token to sell for Sui.
   * @param args.minAmountOut - The minimum amount Sui expected to be received.
   *
   * @returns An object containing the Sui coin and the transaction.
   * @returns values.quoteCoin - The quote coin.
   * @returns values.tx - The Transaction.
   */
  public async dumpToken({
    tx = new Transaction(),
    pool,
    memeToken,
    minAmountOut = 0n,
  }: DumpTokenArgs) {
    if (typeof pool === 'string') {
      invariant(
        isValidSuiObjectId(pool),
        'pool must be a valid Sui objectId or MemezPool'
      );
      pool = await this.getPumpPool(pool);
    }
    invariant(pool.usesTokenStandard, 'pool uses token standard');

    const quoteCoin = tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.PUMP,
      function: 'dump_token',
      arguments: [
        tx.object(pool.objectId),
        tx.object(pool.ipxMemeCoinTreasury),
        this.ownedObject(tx, memeToken),
        tx.pure.u64(minAmountOut),
        this.getVersion(tx),
      ],
      typeArguments: [pool.memeCoinType, pool.quoteCoinType],
    });

    return {
      quoteCoin,
      tx,
    };
  }

  /**
   * Allows the developer to claim the first purchase coins. It can only be done after the pool migrates.
   *
   * @param args - An object containing the necessary arguments to claim the first purchase coins.
   * @param args.tx - Sui client Transaction class to chain move calls.
   * @param args.pool - The objectId of the MemezPool or the full parsed pool.
   *
   * @returns An object containing the meme coin and the transaction.
   * @returns values.memeCoin - The meme coin.
   * @returns values.tx - The Transaction.
   */
  public async devClaim({ tx = new Transaction(), pool }: DevClaimArgs) {
    if (typeof pool === 'string') {
      invariant(
        isValidSuiObjectId(pool),
        'pool must be a valid Sui objectId or MemezPool'
      );
      pool = await this.getPumpPool(pool);
    }

    const memeCoin = tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.PUMP,
      function: 'dev_purchase_claim',
      arguments: [tx.object(pool.objectId), this.getVersion(tx)],
      typeArguments: [pool.memeCoinType, pool.quoteCoinType],
    });

    return {
      memeCoin,
      tx,
    };
  }

  /**
   * Converts a meme token to a meme coin. This is for pools that use the Token Standard. It can only be done after the pool migrates.
   *
   * @param args - An object containing the necessary arguments to convert a meme token to a meme coin.
   * @param args.tx - Sui client Transaction class to chain move calls.
   * @param args.pool - The objectId of the MemezPool or the full parsed pool.
   * @param args.memeToken - The meme token to convert to a meme coin.
   *
   * @returns An object containing the meme coin and the transaction.
   * @returns values.memeCoin - The meme coin.
   * @returns values.tx - The Transaction.
   */
  public async toCoin({ tx = new Transaction(), memeToken, pool }: ToCoinArgs) {
    if (typeof pool === 'string') {
      invariant(
        isValidSuiObjectId(pool),
        'pool must be a valid Sui objectId or MemezPool'
      );
      pool = await this.getPumpPool(pool);
    }

    invariant(pool.usesTokenStandard, 'pool uses token standard');

    const memeCoin = tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.PUMP,
      function: 'to_coin',
      arguments: [tx.object(pool.objectId), this.ownedObject(tx, memeToken)],
      typeArguments: [pool.memeCoinType, pool.quoteCoinType],
    });

    return {
      memeCoin,
      tx,
    };
  }

  /**
   * Migrates the pool to DEX based on the MigrationWitness.
   *
   * @param args - An object containing the necessary arguments to migrate the pool.
   * @param args.tx - Sui client Transaction class to chain move calls.
   * @param args.pool - The objectId of the MemezPool or the full parsed pool.
   *
   * @returns An object containing the migrator and the transaction.
   * @returns values.migrator - The migrator.
   * @returns values.tx - The Transaction.
   */
  public async migrate({ tx = new Transaction(), pool }: MigrateArgs) {
    if (typeof pool === 'string') {
      invariant(
        isValidSuiObjectId(pool),
        'pool must be a valid Sui objectId or MemezPool'
      );
      pool = await this.getPumpPool(pool);
    }

    const migrator = tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.PUMP,
      function: 'migrate',
      arguments: [tx.object(pool.objectId), this.getVersion(tx)],
      typeArguments: [pool.memeCoinType, pool.quoteCoinType],
    });

    return {
      migrator,
      tx,
    };
  }

  /**
   * Distributes the stake holders allocation. It can only be done after the pool migrates.
   *
   * @param args - An object containing the necessary arguments to distribute the stake holders allocation.
   * @param args.tx - Sui client Transaction class to chain move calls.
   * @param args.pool - The objectId of the MemezPool or the full parsed pool.
   *
   * @returns An object containing the transaction.
   */
  public async distributeStakeHoldersAllocation({
    tx = new Transaction(),
    pool,
  }: DistributeStakeHoldersAllocationArgs) {
    if (typeof pool === 'string') {
      invariant(
        isValidSuiObjectId(pool),
        'pool must be a valid Sui objectId or MemezPool'
      );
      pool = await this.getPumpPool(pool);
    }

    invariant(pool.progress === Progress.Migrated, 'pool is not migrated');

    tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.PUMP,
      function: 'distribute_stake_holders_allocation',
      arguments: [
        tx.object(pool.objectId),
        tx.object.clock(),
        this.getVersion(tx),
      ],
      typeArguments: [pool.memeCoinType, pool.quoteCoinType],
    });

    return {
      tx,
    };
  }

  /**
   * Quotes the amount of meme coin received after selling Sui. The swap fee is from the coin in (Sui).
   *
   * @param args - An object containing the necessary arguments to quote the amount of meme coin received after selling Sui.
   * @param args.pool - The objectId of the MemezPool or the full parsed pool.
   * @param args.amount - The amount of Sui to sell.
   *
   * @returns An object containing the amount of meme coin received and the swap in fee.
   * @returns values.memeAmountOut - The amount of meme coin received.
   * @returns values.swapFeeIn - The swap fee in paid in Sui.
   */
  public async quotePump({
    pool,
    amount,
  }: QuoteArgs): Promise<QuotePumpReturnValues> {
    if (BigInt(amount) == 0n) return { memeAmountOut: 0n, swapFeeIn: 0n };
    if (typeof pool === 'string') {
      invariant(
        isValidSuiObjectId(pool),
        'pool must be a valid Sui objectId or MemezPool'
      );
      pool = await this.getPumpPool(pool);
    }

    const tx = new Transaction();

    tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.PUMP,
      function: 'pump_amount',
      arguments: [tx.object(pool.objectId), tx.pure.u64(amount)],
      typeArguments: [pool.memeCoinType, pool.quoteCoinType],
    });

    const result = await devInspectAndGetReturnValues(this.client, tx, [
      [bcs.vector(bcs.u64())],
    ]);

    const [memeAmountOut, swapFeeIn] = result[0][0].map((value: string) =>
      BigInt(value)
    );

    return { memeAmountOut, swapFeeIn };
  }

  /**
   * Quotes the amount of Sui received after selling meme coin. The swap fee is from the coin in (MemeCoin).
   *
   * @param args - An object containing the necessary arguments to quote the amount of Sui received after selling meme coin.
   * @param args.pool - The objectId of the MemezPool or the full parsed pool.
   * @param args.amount - The amount of meme coin to sell.
   *
   * @returns An object containing the amount of Sui received and the swap in fee.
   * @returns values.quoteAmountOut - The amount of Sui received.
   * @returns values.swapFeeIn - The swap fee in paid in MemeCoin.
   * @returns values.burnFee - The burn fee in MemeCoin.
   */
  public async quoteDump({
    pool,
    amount,
  }: QuoteArgs): Promise<QuoteDumpReturnValues> {
    if (BigInt(amount) == 0n)
      return { quoteAmountOut: 0n, swapFeeIn: 0n, burnFee: 0n };

    if (typeof pool === 'string') {
      invariant(
        isValidSuiObjectId(pool),
        'pool must be a valid Sui objectId or MemezPool'
      );
      pool = await this.getPumpPool(pool);
    }

    const tx = new Transaction();

    tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.PUMP,
      function: 'dump_amount',
      arguments: [tx.object(pool.objectId), tx.pure.u64(amount)],
      typeArguments: [pool.memeCoinType, pool.quoteCoinType],
    });

    const result = await devInspectAndGetReturnValues(this.client, tx, [
      [bcs.vector(bcs.u64())],
    ]);

    const [quoteAmountOut, swapFeeIn, burnFee] = result[0][0].map(
      (value: string) => BigInt(value)
    );

    return { quoteAmountOut, swapFeeIn, burnFee };
  }

  /**
   * Gets the pump data for an integrator. The supply must coin the decimal houses. E.g. for Sui would be 1e9.
   *
   * @param args - An object containing the necessary arguments to get the pump data for an integrator.
   * @param args.configurationKey - The configuration key to find an integrator's fee configuration.
   * @param args.totalSupply - The total supply of the meme coin.
   * @param args.quote - The quote type of the meme coin.
   *
   * @returns The pump data for the integrator.
   */
  public async getStableData({
    configurationKey,
    totalSupply,
    quoteCoinType,
  }: GetCurveDataArgs): Promise<StableData> {
    const tx = new Transaction();

    tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.CONFIG,
      function: 'get_stable',
      arguments: [
        tx.sharedObjectRef(this.sharedObjects.CONFIG({ mutable: false })),
        tx.pure.u64(totalSupply),
      ],
      typeArguments: [
        normalizeStructTag(quoteCoinType),
        normalizeStructTag(configurationKey),
      ],
    });

    const result = await devInspectAndGetReturnValues(this.client, tx, [
      [bcs.vector(bcs.u64())],
    ]);

    const [maxTargetQuoteLiquidity, liquidityProvision, memeSaleAmount] =
      result[0][0].map((value: string) => BigInt(value));

    return {
      maxTargetQuoteLiquidity,
      liquidityProvision,
      memeSaleAmount,
    };
  }

  /**
   * Gets the pump data for an integrator. The supply must coin the decimal houses. E.g. for Sui would be 1e9.
   *
   * @param args - An object containing the necessary arguments to get the pump data for an integrator.
   * @param args.configurationKey - The configuration key to find an integrator's fee configuration.
   * @param args.totalSupply - The total supply of the meme coin.
   * @param args.quote - The quote type of the meme coin.
   *
   * @returns The pump data for the integrator.
   */
  public async getPumpData({
    configurationKey,
    totalSupply,
    quoteCoinType,
  }: GetCurveDataArgs): Promise<PumpData> {
    const tx = new Transaction();

    tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.CONFIG,
      function: 'get_pump',
      arguments: [
        tx.sharedObjectRef(this.sharedObjects.CONFIG({ mutable: false })),
        tx.pure.u64(totalSupply),
      ],
      typeArguments: [
        normalizeStructTag(quoteCoinType),
        normalizeStructTag(configurationKey),
      ],
    });

    const result = await devInspectAndGetReturnValues(this.client, tx, [
      [bcs.vector(bcs.u64())],
    ]);

    const [burnTax, virtualLiquidity, targetSuiLiquidity, liquidityProvision] =
      result[0][0].map((value: string) => BigInt(value));

    return {
      burnTax,
      virtualLiquidity,
      targetSuiLiquidity,
      liquidityProvision,
    };
  }
}
