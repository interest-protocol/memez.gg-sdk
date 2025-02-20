import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { has } from 'ramda';
import invariant from 'tiny-invariant';

import { Modules } from './constants';
import {
  MemezFunSharedObjects,
  Network,
  ObjectInput,
  Package,
  SdkConstructorArgs,
  SignInArgs,
} from './memez.types';
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
      function: 'get_version',
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

    return parseMemezPool(this.client, suiObject);
  }

  ownedObject(tx: Transaction, obj: ObjectInput) {
    if (has('objectId', obj) && has('version', obj) && has('digest', obj)) {
      return tx.objectRef(obj);
    }

    return typeof obj === 'string' ? tx.object(obj) : obj;
  }
}
