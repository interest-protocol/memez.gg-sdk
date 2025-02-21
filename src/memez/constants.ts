import {
  normalizeStructTag,
  normalizeSuiAddress,
  normalizeSuiObjectId,
  SUI_TYPE_ARG,
} from '@mysten/sui/utils';

import { Network, OwnedObjects, Package } from './types/memez.types';

export enum Modules {
  FUN = 'memez_fun',
  ACL = 'acl',
  MIGRATOR_LIST = 'memez_migrator_list',
  PUMP = 'memez_pump',
  CONFIG = 'memez_config',
  VERSION = 'memez_allowed_versions',
  METADATA = 'memez_metadata',
}

// TODO: Need to be updated
export enum Treasuries {
  RECRD = '0x2',
  MEMEZ = '0x3',
  WINX = '0x4',
  INSIDEX = '0x5',
  DEXTER = '0x6',
}

export enum Progress {
  Bonding = 'Bonding',
  Migrating = 'Migrating',
  Migrated = 'Migrated',
}

export const PACKAGES: Record<Network, Package> = {
  [Network.Mainnet]: {
    MEMEZ_FUN: {
      original: normalizeSuiAddress('0x0'),
      latest: normalizeSuiAddress('0x0'),
    },
    ACL: {
      original: normalizeSuiAddress('0x0'),
      latest: normalizeSuiAddress('0x0'),
    },
    VESTING: {
      original: normalizeSuiAddress('0x0'),
      latest: normalizeSuiAddress('0x0'),
    },
    MEMEZ_MIGRATOR: {
      original: normalizeSuiAddress('0x0'),
      latest: normalizeSuiAddress('0x0'),
    },
    MEMEZ_WITNESS: {
      original: normalizeSuiAddress('0x0'),
      latest: normalizeSuiAddress('0x0'),
    },
  },
  [Network.Testnet]: {
    MEMEZ_FUN: {
      original: normalizeSuiAddress(
        '0x63fed690a1154cfc4b31658443227de047cf3d305179aa5836e177c9efa57854'
      ),
      latest: normalizeSuiAddress(
        '0x63fed690a1154cfc4b31658443227de047cf3d305179aa5836e177c9efa57854'
      ),
    },
    ACL: {
      original: normalizeSuiAddress(
        '0x5d406d0307d260f6ffc01f87960b0c28b8c5c3f0e8e71897b1a924a757232179'
      ),
      latest: normalizeSuiAddress(
        '0x5d406d0307d260f6ffc01f87960b0c28b8c5c3f0e8e71897b1a924a757232179'
      ),
    },
    VESTING: {
      original: normalizeSuiAddress(
        '0xdada5d84429db8d56a775593b2893fc030826055dc84fa47ccdfd4933a63d093'
      ),
      latest: normalizeSuiAddress(
        '0xdada5d84429db8d56a775593b2893fc030826055dc84fa47ccdfd4933a63d093'
      ),
    },
    MEMEZ_MIGRATOR: {
      original: normalizeSuiAddress(
        '0x1c709c9f80361a4fb32a122b46a7381f8f6cf267016fdbf6e87b04622ba3476b'
      ),
      latest: normalizeSuiAddress(
        '0x1c709c9f80361a4fb32a122b46a7381f8f6cf267016fdbf6e87b04622ba3476b'
      ),
    },
    MEMEZ_WITNESS: {
      original: normalizeSuiAddress(
        '0x06267071d0eecfb7d16418cb71da4c7b7941b28208a71086ff3e47731c2d263a'
      ),
      latest: normalizeSuiAddress(
        '0x06267071d0eecfb7d16418cb71da4c7b7941b28208a71086ff3e47731c2d263a'
      ),
    },
  },
} as const;

export const OWNED_OBJECTS: Record<Network, OwnedObjects> = {
  [Network.Mainnet]: {
    SUPER_ADMIN: normalizeSuiObjectId('0x0'),
    ACL_UPGRADE_CAP: normalizeSuiObjectId('0x0'),
    VESTING_UPGRADE_CAP: normalizeSuiObjectId('0x0'),
    MEMEZ_FUN_UPGRADE_CAP: normalizeSuiObjectId('0x0'),
    MEMEZ_MIGRATOR_UPGRADE_CAP: normalizeSuiObjectId('0x0'),
    ADMIN: normalizeSuiObjectId('0x0'),
  },
  [Network.Testnet]: {
    SUPER_ADMIN: normalizeSuiObjectId(
      '0xe3058ee659ef181a8669da12c3368e5b87ac93cb6a66a6a78fe3e812dcb04d15'
    ),
    ACL_UPGRADE_CAP: normalizeSuiObjectId(
      '0x5e56e4dda714c27c1f246c9e570ce0aee4dc25a520e2d6e6931aa7a7b72cdd72'
    ),
    VESTING_UPGRADE_CAP: normalizeSuiObjectId(
      '0x5aecaddf8df660e91d7b002a6bea814fdb5ef34f940ae7bc4ac17db817c51bed'
    ),
    MEMEZ_FUN_UPGRADE_CAP: normalizeSuiObjectId(
      '0xea9d2a2c0bce0646024085055dfea8840f1ce6eb448593e1243009b9d89edcfc'
    ),
    MEMEZ_MIGRATOR_UPGRADE_CAP: normalizeSuiObjectId(
      '0x0806f525f06e0fcf0f79baeabcf4c49de2be292b87f59c9fabf59fbf779fe2f4'
    ),
    ADMIN: normalizeSuiObjectId(
      '0x710cece8f8c6bfacf8bdac919058cabb842d451b7ae6a6fb8e42c9c3a7af415b'
    ),
  },
} as const;

export const SHARED_OBJECTS = {
  [Network.Mainnet]: {
    ACL: ({ mutable }: { mutable: boolean }) => ({
      objectId: normalizeSuiObjectId('0x0'),
      initialSharedVersion: '1',
      mutable,
    }),
    VERSION: ({ mutable }: { mutable: boolean }) => ({
      objectId: normalizeSuiObjectId('0x0'),
      initialSharedVersion: '1',
      mutable,
    }),
    CONFIG: ({ mutable }: { mutable: boolean }) => ({
      objectId: normalizeSuiObjectId('0x0'),
      initialSharedVersion: '1',
      mutable,
    }),
    MIGRATOR_LIST: ({ mutable }: { mutable: boolean }) => ({
      objectId: normalizeSuiObjectId('0x0'),
      initialSharedVersion: '1',
      mutable,
    }),
  } as const,
  [Network.Testnet]: {
    ACL: ({ mutable }: { mutable: boolean }) => ({
      objectId: normalizeSuiObjectId(
        '0x1b5397ee2f6f8ccfb26016c1ed996f25b2277acb9ed5173fa0bed386360960d8'
      ),
      initialSharedVersion: '384530228',
      mutable,
    }),
    MIGRATOR_LIST: ({ mutable }: { mutable: boolean }) => ({
      objectId: normalizeSuiObjectId(
        '0xf35e6124170d1c7618090bed501edd8fc5f8d8f2d053fbc5f12db93300491ab7'
      ),
      initialSharedVersion: '384530230',
      mutable,
    }),
    VERSION: ({ mutable }: { mutable: boolean }) => ({
      objectId: normalizeSuiObjectId(
        '0x0e74ece4efbc1a15b1ff5bd5653e13281f691b9db8faf669b13783ecc414c848'
      ),
      initialSharedVersion: '384530230',
      mutable,
    }),
    CONFIG: ({ mutable }: { mutable: boolean }) => ({
      objectId: normalizeSuiObjectId(
        '0xd7d747343106d3586f9d96dce4741702de9033875b007f4a485f6593b2e53d79'
      ),
      initialSharedVersion: '384530230',
      mutable,
    }),
  } as const,
};

export const MIGRATOR_WITNESSES = {
  [Network.Mainnet]: {
    TEST: '',
  },
  [Network.Testnet]: {
    TEST: `${PACKAGES[Network.Testnet].MEMEZ_MIGRATOR.original}::dummy::Witness`,
  },
} as const;

export const CONFIG_KEYS = {
  [Network.Mainnet]: {
    // TODO: Need to be updated
    DEFAULT: '0',
    RECRD: '1',
    MEMEZ: '2',
    WINX: '3',
    DEXTER: '4',
    INSIDEX: '5',
  },
  [Network.Testnet]: {
    DEFAULT: `${PACKAGES[Network.Testnet].MEMEZ_FUN.original}::memez_config::DefaultKey`,
    RECRD: `${PACKAGES[Network.Testnet].MEMEZ_WITNESS.original}::memez_witness::Recrd`,
    MEMEZ: `${PACKAGES[Network.Testnet].MEMEZ_WITNESS.original}::memez_witness::Memez`,
    WINX: `${PACKAGES[Network.Testnet].MEMEZ_WITNESS.original}::memez_witness::Winx`,
    DEXTER: `${PACKAGES[Network.Testnet].MEMEZ_WITNESS.original}::memez_witness::Dexter`,
    INSIDEX: `${PACKAGES[Network.Testnet].MEMEZ_WITNESS.original}::memez_witness::Insidex`,
  },
} as const;

export const CONFIG_MODELS = {
  [Network.Mainnet]: {
    FEE: '',
    PUMP: '',
    STABLE: '',
    AUCTION: '',
  },
  [Network.Testnet]: {
    FEE: `${PACKAGES[Network.Testnet].MEMEZ_FUN.original}::memez_fees::MemezFees`,
    PUMP: `${PACKAGES[Network.Testnet].MEMEZ_FUN.original}::memez_pump_model::PumpModel`,
    STABLE: `${PACKAGES[Network.Testnet].MEMEZ_FUN.original}::memez_stable_model::StableModel`,
    AUCTION: `${PACKAGES[Network.Testnet].MEMEZ_FUN.original}::memez_auction_model::AuctionModel`,
  },
} as const;

export const MAX_BPS = 10_000n;

export const CONFIG_QUOTE_COIN_TYPES = {
  [Network.Mainnet]: {
    [CONFIG_KEYS[Network.Mainnet].DEFAULT]: normalizeStructTag(SUI_TYPE_ARG),
  },
  [Network.Testnet]: {
    [CONFIG_KEYS[Network.Testnet].DEFAULT]: normalizeStructTag(SUI_TYPE_ARG),
  },
} as const;
