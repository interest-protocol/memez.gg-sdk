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
      '0x02b03f530b2683f1c3d29a0ef5ea200759c6d5b238b13f69007726aa7f38caef'
    ),
    latest: normalizeSuiAddress(
      '0x02b03f530b2683f1c3d29a0ef5ea200759c6d5b238b13f69007726aa7f38caef'
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
      '0x3e9ecca63e287f5216c1575e384fb388426c709cc47b809bd143974522402c4a'
    ),
    latest: normalizeSuiAddress(
      '0x3e9ecca63e287f5216c1575e384fb388426c709cc47b809bd143974522402c4a'
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
    '0x7fcfeb495742a263d392701fd120b4eeaa17c9202eaa6c5101ceea6d4000a753'
  ),
  TEST_MEMEZ_MIGRATOR_UPGRADE_CAP: normalizeSuiObjectId(
    '0xeecfd5afa1fdef204febf0358aa6cb824e0bc179e3bbce6e07891d07ed25d306'
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
      '0xc2a2ff11953120cac96dd7cb48fc8e0a02ded5375723f42d32f317c24f7cc358'
    ),
    initialSharedVersion: '395367237',
    mutable,
  }),
  CONFIG: ({ mutable }: { mutable: boolean }) => ({
    objectId: normalizeSuiObjectId(
      '0x248888f18b69b41d6c41f1e6ee92e1f8d2e1c88b87c9ece6eab708ef5e3e9bde'
    ),
    initialSharedVersion: '395367237',
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
    '0x85596cda5cefeba5fb75d7d07f77bbe1166615b1c06b16b895613cadb718b53a::xpump::MemezConfigKey',
} as const;

export const MAX_BPS = 10_000n;

export const CONFIG_QUOTE_COIN_TYPES = {
  [CONFIG_KEYS.RECRD]: normalizeStructTag(SUI_TYPE_ARG),
  [CONFIG_KEYS.NEXA]: normalizeStructTag(SUI_TYPE_ARG),
  [CONFIG_KEYS.MEMEZ]: normalizeStructTag(SUI_TYPE_ARG),
} as const;
