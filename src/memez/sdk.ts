import { bcs } from '@mysten/sui/bcs';
import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { normalizeStructTag, normalizeSuiAddress } from '@mysten/sui/utils';
import { has } from 'ramda';
import invariant from 'tiny-invariant';

import { Modules } from './constants';
import {
  GetPoolMetadataArgs,
  MemezFunSharedObjects,
  Network,
  ObjectInput,
  Package,
  SdkConstructorArgs,
  SignInArgs,
} from './memez.types';
import { VecMap } from './structs';
import { getSdkDefaultArgs, parseMemezPool } from './utils';

export class SDK {
  packages: Package;
  sharedObjects: MemezFunSharedObjects;
  modules = Modules;

  #network: Network;
  #rpcUrl: string;

  client: SuiClient;

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

    invariant(
      data.network,
      'You must provide network for this specific network'
    );

    this.#network = data.network;
    this.#rpcUrl = data.fullNodeUrl;
    this.packages = data.packages;
    this.sharedObjects = data.sharedObjects;
    this.client = new SuiClient({ url: data.fullNodeUrl });
  }

  public networkConfig() {
    return {
      rpcUrl: this.#rpcUrl,
      network: this.#network,
    };
  }

  signIn({ tx = new Transaction(), admin }: SignInArgs) {
    const authWitness = tx.moveCall({
      package: this.packages.ACL.latest,
      module: this.modules.ACL,
      function: 'sign_in',
      arguments: [
        tx.sharedObjectRef(this.sharedObjects.ACL({ mutable: false })),
        this.ownedObject(tx, admin),
      ],
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

  /**
   * Retrieves the Memez pool object from Sui and parses it.
   *
   * @param pumpId - The objectId of the MemezPool.
   *
   * @returns A parsed MemezPool object.
   */
  public async getPumpPool(pumpId: string) {
    const suiObject = await this.client.getObject({
      id: pumpId,
      options: { showContent: true },
    });

    const pool = await parseMemezPool(this.client, suiObject);

    pool.metadata = await this.getPoolMetadata({
      poolId: pool.objectId,
      quoteCoinType: pool.quoteCoinType,
      memeCoinType: pool.memeCoinType,
      curveType: pool.curveType,
    });

    return pool;
  }

  public async getPoolMetadata({
    poolId,
    quoteCoinType,
    memeCoinType,
    curveType,
  }: GetPoolMetadataArgs): Promise<Record<string, string>> {
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

    return VecMap(bcs.string(), bcs.string())
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
  }

  ownedObject(tx: Transaction, obj: ObjectInput) {
    if (has('objectId', obj) && has('version', obj) && has('digest', obj)) {
      return tx.objectRef(obj);
    }

    return typeof obj === 'string' ? tx.object(obj) : obj;
  }
}
