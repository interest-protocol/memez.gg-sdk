import {
  normalizeStructTag,
  normalizeSuiAddress,
  normalizeSuiObjectId,
  SUI_TYPE_ARG,
} from '@mysten/sui/utils';

export enum Modules {
  FUN = 'memez_fun',
  ACL = 'access_control',
  PUMP = 'memez_pump',
  CONFIG = 'memez_config',
  VERSION = 'memez_allowed_versions',
  METADATA = 'memez_metadata',
  STABLE = 'memez_stable',
  PUMP_CONFIG = 'memez_pump_config',
  STABLE_CONFIG = 'memez_stable_config',
}

// TODO: Need to be updated
export enum Treasuries {
  RECRD = '0x2',
  MEMEZ = '0x3',
  NEXA = '0x4',
  XPUMP = '0x5',
}

export enum Progress {
  Bonding = 'Bonding',
  Migrating = 'Migrating',
  Migrated = 'Migrated',
}

export const PACKAGES = {
  MEMEZ_FUN: {
    original: normalizeSuiAddress(
      '0x5c5f30830cf44e4016c8e5e4c71d8f0e5b47a2fb02c56a68c81f9fd8a2151d2b'
    ),
    latest: normalizeSuiAddress(
      '0x5c5f30830cf44e4016c8e5e4c71d8f0e5b47a2fb02c56a68c81f9fd8a2151d2b'
    ),
  },
  MEMEZ: {
    original: normalizeSuiAddress(
      '0x17209c541f1a372b811a42eaf95e62cd1eb46127e438f052432bd1c2318bc1c9'
    ),
    latest: normalizeSuiAddress(
      '0x17209c541f1a372b811a42eaf95e62cd1eb46127e438f052432bd1c2318bc1c9'
    ),
  },
  VESTING: {
    original: normalizeSuiAddress(
      '0xbc838799ce0c571fddb5c650adae05ed141070501558743f2f28d2d3fbede8d6'
    ),
    latest: normalizeSuiAddress(
      '0xbc838799ce0c571fddb5c650adae05ed141070501558743f2f28d2d3fbede8d6'
    ),
  },
  TEST_MEMEZ_MIGRATOR: {
    original: normalizeSuiAddress(
      '0xe979915ba93d8cf6a0a4bb5bde74e1d87b06328764c89f54872a4b3319eae038'
    ),
    latest: normalizeSuiAddress(
      '0xe979915ba93d8cf6a0a4bb5bde74e1d87b06328764c89f54872a4b3319eae038'
    ),
  },
  MEMEZ_WITNESS: {
    original: normalizeSuiAddress(
      '0x6083aeb2d22514d0e849fdde75b60c7d0f857facefb3b2d7d2e975b78d8a0c75'
    ),
    latest: normalizeSuiAddress(
      '0x6083aeb2d22514d0e849fdde75b60c7d0f857facefb3b2d7d2e975b78d8a0c75'
    ),
  },
  INTEREST_ACL: {
    original: normalizeSuiAddress(
      '0x32ffaa298a6d6528864bf2b32acfcb7976a95e26dcc24e40e2535c0551b9d68a'
    ),
    latest: normalizeSuiAddress(
      '0x32ffaa298a6d6528864bf2b32acfcb7976a95e26dcc24e40e2535c0551b9d68a'
    ),
  },
} as const;

export const OWNED_OBJECTS = {
  MEMEZ_SUPER_ADMIN: normalizeSuiObjectId(
    '0x2c1dbc3cd98c3deb1ce5aba8000564211cb8a391bb7707e642baeb08bd52207f'
  ),
  VESTING_UPGRADE_CAP: normalizeSuiObjectId(
    '0x91d2da1c0929db3e040d483fbbf5f169ce9b964b07ce3c084efbfcccf74220ec'
  ),
  MEMEZ_FUN_UPGRADE_CAP: normalizeSuiObjectId(
    '0x137a3529311ae8f9f3450fff3dee24a6a9f42d03e824fb27d1b399519f481012'
  ),
  TEST_MEMEZ_MIGRATOR_UPGRADE_CAP: normalizeSuiObjectId(
    '0x1ffa8db729e942337ff413546aa120e38954a14c060108a106f2b53c39bcae2b'
  ),
  ADMIN: normalizeSuiObjectId(
    '0xa47aca8f255e3b88348a768ff0f9031a01bd49eb57592eb72b333327176aaa26'
  ),
  MEMEZ_PUBLISHER: normalizeSuiObjectId(
    '0x97167172ddc539921db1c7443ce30ba2bc5969c3403007e3147fdd3fbe01d54d'
  ),
  MEMEZ_UPGRADE_CAP: normalizeSuiObjectId(
    '0x43461df272d965d153d50789af15adc03359433e54eb522d0e484630789c16ee'
  ),
} as const;

export const SHARED_OBJECTS = {
  ACL: ({ mutable }: { mutable: boolean }) => ({
    objectId: normalizeSuiObjectId(
      '0xc8502b2e13ce57165218abaacd36850c7ea70a5ef4c0b80053eb0f6aaf1d338e'
    ),
    initialSharedVersion: '395367236',
    mutable,
  }),
  VERSION: ({ mutable }: { mutable: boolean }) => ({
    objectId: normalizeSuiObjectId(
      '0x6506a91423c4658c3c0f4527ecc5c9d49ac5ee567290db505a3dcdcaf738c657'
    ),
    initialSharedVersion: '395367263',
    mutable,
  }),
  CONFIG: ({ mutable }: { mutable: boolean }) => ({
    objectId: normalizeSuiObjectId(
      '0x3ce7d922912bf3427434523a72a99d3f43444e40ab21f46e00f14e8f478886eb'
    ),
    initialSharedVersion: '395367263',
    mutable,
  }),
} as const;

export const MIGRATOR_WITNESSES = {
  TEST: `${PACKAGES.TEST_MEMEZ_MIGRATOR.original}::dummy::Witness`,
} as const;

export const TYPES = {
  MEMEZ_OTW: `${PACKAGES.MEMEZ.original}::memez::MEMEZ`,
  MEMEZ_FEE: `${PACKAGES.MEMEZ_FUN.original}::memez_fees::MemezFees`,
} as const;

export const CONFIG_KEYS = {
  RECRD: `${PACKAGES.MEMEZ_WITNESS.original}::memez_witness::Recrd`,
  NEXA: `${PACKAGES.MEMEZ_WITNESS.original}::memez_witness::Nexa`,
  MEMEZ: `${PACKAGES.MEMEZ_WITNESS.original}::memez_witness::Memez`,
  XPUMP:
    '0x9877fd4cade7740a391e4bb25c81bbe4763a905dd3f26608e9d53e9cd5f14c06::xpump::MemezConfigKey',
} as const;

export const MAX_BPS = 10_000n;

export const CONFIG_QUOTE_COIN_TYPES = {
  [CONFIG_KEYS.RECRD]: normalizeStructTag(SUI_TYPE_ARG),
  [CONFIG_KEYS.NEXA]: normalizeStructTag(SUI_TYPE_ARG),
  [CONFIG_KEYS.MEMEZ]: normalizeStructTag(SUI_TYPE_ARG),
} as const;
