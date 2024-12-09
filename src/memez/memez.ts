import { Transaction } from '@mysten/sui/transactions';
import {
  isValidSuiAddress,
  normalizeStructTag,
  SUI_FRAMEWORK_ADDRESS,
  SUI_TYPE_ARG,
} from '@mysten/sui/utils';
import invariant from 'tiny-invariant';

import {
  DumpArgs,
  NewPumpPoolArgs,
  PumpArgs,
  SdkConstructorArgs,
} from './memez.types';
import { SDK } from './sdk';
import { parseMemezPool } from './utils';

export class MemezFunSDK extends SDK {
  #defaultSupply = 1_000_000_000_000_000_000n;

  constructor(args: SdkConstructorArgs | undefined | null = null) {
    super(args);
  }

  public newPumpPool({
    tx = new Transaction(),
    creationSuiFee = this.#zeroSuiCoin(tx),
    memeCoinTreasuryCap,
    totalSupply = this.#defaultSupply,
    useTokenStandard = false,
    firstPurchase = this.#zeroSuiCoin(tx),
    metadata = {},
    developer,
    configurationKey,
    migrationWitness,
    memeCoinType,
  }: NewPumpPoolArgs) {
    invariant(BigInt(totalSupply) > 0n, 'totalSupply must be greater than 0');
    invariant(
      isValidSuiAddress(developer),
      'developer must be a valid Sui address'
    );

    const metadataCap = tx.moveCall({
      package: this.packages.MEMEZ_FUN,
      module: this.modules.PUMP,
      function: 'new',
      arguments: [
        tx.object(this.sharedObjects.CONFIG.IMMUT),
        tx.object(this.sharedObjects.MIGRATOR_LIST.IMMUT),
        this.object(tx, memeCoinTreasuryCap),
        this.object(tx, creationSuiFee),
        tx.pure.u64(totalSupply),
        tx.pure.bool(useTokenStandard),
        this.object(tx, firstPurchase),
        tx.pure.vector('string', Object.keys(metadata)),
        tx.pure.vector('string', Object.values(metadata)),
        tx.pure.address(developer),
        this.#getVersion(tx),
      ],
      typeArguments: [
        memeCoinType,
        normalizeStructTag(configurationKey),
        normalizeStructTag(migrationWitness),
      ],
    });

    return {
      metadataCap,
      tx,
    };
  }

  public async pump({
    tx = new Transaction(),
    pool,
    suiCoin,
    minAmountOut = 0n,
  }: PumpArgs) {
    if (typeof pool === 'string') {
      invariant(
        isValidSuiAddress(pool),
        'pool must be a valid Sui address or MemezPool'
      );
      pool = await this.getPumpPool(pool);
    }

    const memeCoin = tx.moveCall({
      package: this.packages.MEMEZ_FUN,
      module: this.modules.PUMP,
      function: 'pump',
      arguments: [
        tx.object(pool.objectId),
        this.object(tx, suiCoin),
        tx.pure.u64(minAmountOut),
        this.#getVersion(tx),
      ],
      typeArguments: [pool.memeCoinType],
    });

    return {
      memeCoin,
      tx,
    };
  }

  public async dump({
    tx = new Transaction(),
    pool,
    memeCoin,
    minAmountOut = 0n,
  }: DumpArgs) {
    if (typeof pool === 'string') {
      invariant(
        isValidSuiAddress(pool),
        'pool must be a valid Sui address or MemezPool'
      );
      pool = await this.getPumpPool(pool);
    }

    const suiCoin = tx.moveCall({
      package: this.packages.MEMEZ_FUN,
      module: this.modules.PUMP,
      function: 'dump',
      arguments: [
        tx.object(pool.objectId),
        tx.object(pool.ipxMemeCoinTreasury),
        this.object(tx, memeCoin),
        tx.pure.u64(minAmountOut),
        this.#getVersion(tx),
      ],
      typeArguments: [pool.memeCoinType],
    });

    return {
      suiCoin,
      tx,
    };
  }

  public async getPumpPool(pumpId: string) {
    const suiObject = await this.client.getObject({
      id: pumpId,
      options: { showContent: true },
    });

    return parseMemezPool(this.client, suiObject);
  }

  #getVersion(tx: Transaction) {
    return tx.moveCall({
      package: this.packages.MEMEZ_FUN,
      module: this.modules.VERSION,
      function: 'get_version',
      arguments: [tx.object(this.sharedObjects.VERSION.IMMUT)],
    });
  }

  #zeroSuiCoin(tx: Transaction) {
    return tx.moveCall({
      package: SUI_FRAMEWORK_ADDRESS,
      module: 'coin',
      function: 'zero',
      typeArguments: [SUI_TYPE_ARG],
    });
  }
}
