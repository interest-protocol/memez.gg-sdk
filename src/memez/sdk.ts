import { bcs } from '@mysten/sui/bcs';
import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { ObjectRef } from '@mysten/sui/transactions';
import {
  isValidSuiObjectId,
  normalizeStructTag,
  normalizeSuiAddress,
  normalizeSuiObjectId,
} from '@mysten/sui/utils';
import { SUI_FRAMEWORK_ADDRESS, SUI_TYPE_ARG } from '@mysten/sui/utils';
import { devInspectAndGetReturnValues } from '@polymedia/suitcase-core';
import { has, pathOr } from 'ramda';
import invariant from 'tiny-invariant';

import { Modules, PACKAGES } from './constants';
import { VecMap } from './structs';
import { MemezFees } from './structs';
import {
  GetFeesArgs,
  GetPoolMetadataArgs,
  KeepTokenArgs,
  MemezFunSharedObjects,
  MemezPool,
  ObjectInput,
  PumpState,
  SdkConstructorArgs,
  SignInArgs,
  StableState,
} from './types/memez.types';
import { getSdkDefaultArgs, parsePumpPool, parseStablePool } from './utils';

const pumpPoolCache = new Map<string, MemezPool<PumpState>>();
const stablePoolCache = new Map<string, MemezPool<StableState>>();
const metadataCache = new Map<string, Record<string, string>>();

export class SDK {
  packages: typeof PACKAGES;
  sharedObjects: MemezFunSharedObjects;
  modules = Modules;

  memezOTW: string;

  MAX_BPS = 10_000;

  MAX_U64 = 18446744073709551615n;

  #rpcUrl: string;

  client: SuiClient;

  defaultSupply = 1_000_000_000_000_000_000n;

  constructor(args: SdkConstructorArgs | undefined | null = null) {
    const data = {
      ...getSdkDefaultArgs(),
      ...args,
    };

    invariant(
      data.fullNodeUrl,
      'You must provide fullNodeUrl for this specific network'
    );

    invariant(
      data.packages,
      'You must provide package addresses for this specific network'
    );

    invariant(
      data.sharedObjects,
      'You must provide sharedObjects for this specific network'
    );

    this.#rpcUrl = data.fullNodeUrl;
    this.packages = data.packages;
    this.sharedObjects = data.sharedObjects;
    this.client = new SuiClient({ url: data.fullNodeUrl });
    this.memezOTW = `${PACKAGES.MEMEZ.original}::memez::MEMEZ`;
  }

  public rpcUrl() {
    return this.#rpcUrl;
  }

  /**
   * Gets an integrator.
   *
   * @param args - An object containing the necessary arguments to get the fees for the pool.
   * @param args.configurationKey - The configuration key to find an integrator's fee configuration.
   *
   * @returns The fees for the pool.
   */
  public async getFees({
    configurationKey,
  }: GetFeesArgs): Promise<typeof MemezFees.$inferType> {
    const tx = new Transaction();

    tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.CONFIG,
      function: 'fees',
      arguments: [
        tx.sharedObjectRef(this.sharedObjects.CONFIG({ mutable: false })),
      ],
      typeArguments: [normalizeStructTag(configurationKey)],
    });

    const result = await devInspectAndGetReturnValues(this.client, tx, [
      [MemezFees],
    ]);

    return result[0][0];
  }

  /**
   * Utility function to return the Token to the sender.
   *
   * @param args - An object containing the necessary arguments to keep the meme token in the pool.
   * @param args.tx - Sui client Transaction class to chain move calls.
   * @param args.memeCoinType - The type of the meme coin.
   * @param args.token - The meme token to return to the sender.
   *
   * @returns An object containing the transaction.
   * @returns values.tx - The Transaction.
   */
  public async keepToken({
    tx = new Transaction(),
    memeCoinType,
    token,
  }: KeepTokenArgs) {
    tx.moveCall({
      package: SUI_FRAMEWORK_ADDRESS,
      module: 'token',
      function: 'keep',
      arguments: [this.ownedObject(tx, token)],
      typeArguments: [memeCoinType],
    });

    return {
      tx,
    };
  }

  signIn({ tx = new Transaction(), admin }: SignInArgs) {
    const authWitness = tx.moveCall({
      package: this.packages.INTEREST_ACL.latest,
      module: this.modules.ACL,
      function: 'sign_in',
      arguments: [
        tx.sharedObjectRef(this.sharedObjects.ACL({ mutable: false })),
        this.ownedObject(tx, admin),
      ],
      typeArguments: [normalizeStructTag(this.memezOTW)],
    });

    return {
      tx,
      authWitness,
    };
  }

  getVersion(tx: Transaction) {
    return tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.VERSION,
      function: 'get_allowed_versions',
      arguments: [
        tx.sharedObjectRef(this.sharedObjects.VERSION({ mutable: false })),
      ],
    });
  }

  zeroSuiCoin(tx: Transaction) {
    return tx.moveCall({
      package: SUI_FRAMEWORK_ADDRESS,
      module: 'coin',
      function: 'zero',
      typeArguments: [SUI_TYPE_ARG],
    });
  }

  /**
   * Retrieves the Memez pool object from Sui and parses it.
   *
   * @param pumpId - The objectId of the MemezPool.
   *
   * @returns A parsed MemezPool object.
   */
  public async getPumpPool(pumpId: string) {
    pumpId = normalizeSuiObjectId(pumpId);

    if (pumpPoolCache.has(pumpId)) {
      return pumpPoolCache.get(pumpId)!;
    }

    const suiObject = await this.client.getObject({
      id: pumpId,
      options: { showContent: true },
    });

    const pool = await parsePumpPool(this.client, suiObject);

    pool.metadata = await this.getPoolMetadata({
      poolId: pool.objectId,
      quoteCoinType: pool.quoteCoinType,
      memeCoinType: pool.memeCoinType,
      curveType: pool.curveType,
    });

    pumpPoolCache.set(pumpId, pool);

    return pool;
  }

  /**
   * Retrieves the Memez pool object from Sui and parses it.
   *
   * @param stableId - The objectId of the MemezPool.
   *
   * @returns A parsed MemezPool object.
   */
  public async getStablePool(stableId: string) {
    stableId = normalizeSuiObjectId(stableId);

    if (stablePoolCache.has(stableId)) {
      return stablePoolCache.get(stableId)!;
    }

    const suiObject = await this.client.getObject({
      id: stableId,
      options: { showContent: true },
    });

    const pool = await parseStablePool(this.client, suiObject);

    pool.metadata = await this.getPoolMetadata({
      poolId: pool.objectId,
      quoteCoinType: pool.quoteCoinType,
      memeCoinType: pool.memeCoinType,
      curveType: pool.curveType,
    });

    stablePoolCache.set(stableId, pool);

    return pool;
  }

  public async getPoolMetadata({
    poolId,
    quoteCoinType,
    memeCoinType,
    curveType,
  }: GetPoolMetadataArgs): Promise<Record<string, string>> {
    poolId = normalizeSuiObjectId(poolId);

    if (metadataCache.has(poolId)) {
      return metadataCache.get(poolId)!;
    }

    const tx = new Transaction();

    tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.FUN,
      function: 'metadata',
      arguments: [tx.object(poolId)],
      typeArguments: [
        normalizeStructTag(curveType),
        normalizeStructTag(memeCoinType),
        normalizeStructTag(quoteCoinType),
      ],
    });

    const metadataVecMap = await this.client.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: normalizeSuiAddress('0x0'),
    });

    invariant(
      metadataVecMap.results?.[0]?.returnValues?.[0]?.[0],
      'No metadata found'
    );

    const metadata = VecMap(bcs.string(), bcs.string())
      .parse(Uint8Array.from(metadataVecMap.results[0].returnValues[0][0]))
      .contents.reduce(
        (acc: Record<string, string>, elem) => {
          return {
            ...acc,
            [elem.key]: elem.value,
          };
        },
        {} as Record<string, string>
      );

    metadataCache.set(poolId, metadata);

    return metadata;
  }

  async getCoinMetadataAndType(memeCoinTreasuryCap: string | ObjectRef) {
    const memeCoinTreasuryCapId =
      typeof memeCoinTreasuryCap === 'string'
        ? memeCoinTreasuryCap
        : memeCoinTreasuryCap.objectId;

    invariant(
      isValidSuiObjectId(memeCoinTreasuryCapId),
      'memeCoinTreasuryCap must be a valid Sui objectId'
    );

    const treasuryCap = await this.client.getObject({
      id: memeCoinTreasuryCapId,
      options: {
        showType: true,
        showContent: true,
      },
    });

    const treasuryCapTotalSupply = +pathOr(
      /// Force an error if we do not find the field
      '1',
      ['data', 'content', 'fields', 'total_supply', 'fields', 'value'],
      treasuryCap
    );

    invariant(
      treasuryCapTotalSupply === 0,
      'TreasuryCap Error: Total Supply is not 0 or not found'
    );

    const memeCoinType = treasuryCap.data?.type?.split('<')[1].slice(0, -1);

    invariant(memeCoinType, 'Invalid TreasuryCap: no memeCoinType found');

    const coinMetadata = await this.client.getCoinMetadata({
      coinType: memeCoinType,
    });

    invariant(coinMetadata?.id, 'Invalid TreasuryCap: no coin metadata found');

    return {
      memeCoinType,
      coinMetadataId: coinMetadata.id!,
    };
  }

  ownedObject(tx: Transaction, obj: ObjectInput) {
    if (has('objectId', obj) && has('version', obj) && has('digest', obj)) {
      return tx.objectRef(obj);
    }

    return typeof obj === 'string' ? tx.object(obj) : obj;
  }
}
