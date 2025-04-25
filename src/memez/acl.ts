import { AclSDK } from '@interest-protocol/acl-sdk';
import { getFullnodeUrl } from '@mysten/sui/client';

import { PACKAGES, SHARED_OBJECTS, TYPES } from './constants';

export const makeMemezAclSdk = (rpc: string = getFullnodeUrl('testnet')) =>
  new AclSDK({
    package: PACKAGES.INTEREST_ACL.latest,
    fullNodeUrl: rpc,
    otw: TYPES.MEMEZ_OTW,
    aclObjectId: SHARED_OBJECTS.ACL({ mutable: true }).objectId,
    aclInitialSharedVersion: SHARED_OBJECTS.ACL({ mutable: true })
      .initialSharedVersion,
  });
