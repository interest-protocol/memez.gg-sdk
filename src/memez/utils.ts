import {
  getFullnodeUrl,
  SuiClient,
  SuiObjectResponse,
} from '@mysten/sui/client';
import { normalizeStructTag, normalizeSuiObjectId } from '@mysten/sui/utils';
import { Decimal } from 'decimal.js';
import { pathOr } from 'ramda';

import { PACKAGES, SHARED_OBJECTS } from './constants';
import {
  GetMemeCoinMarketCapArgs,
  MemezPool,
  PumpState,
  SdkConstructorArgs,
} from './memez.types';
import { Network } from './memez.types';

export const getSdkDefaultArgs = (
  network = Network.Testnet
): SdkConstructorArgs => ({
  packages: PACKAGES[network],
  fullNodeUrl: getFullnodeUrl(
    network === Network.Mainnet ? 'mainnet' : 'testnet'
  ),
  sharedObjects: SHARED_OBJECTS[network],
  network,
});

// USD Price
export const getMemeCoinMarketCap = ({
  suiBalance,
  virtualLiquidity,
  memeBalance,
  suiUSDCPrice,
  memeCoinTotalSupply = 1_000_000_000n,
}: GetMemeCoinMarketCapArgs) => {
  const suiBalanceDecimal = new Decimal(suiBalance.toString());
  const virtualLiquidityDecimal = new Decimal(virtualLiquidity.toString());
  const memeBalanceDecimal = new Decimal(memeBalance.toString());
  const suiUSDCPriceDecimal = new Decimal(suiUSDCPrice.toString());

  const memeCoinPrice = suiBalanceDecimal
    .plus(virtualLiquidityDecimal)
    .times(suiUSDCPriceDecimal)
    .div(memeBalanceDecimal);

  return memeCoinPrice.times(memeCoinTotalSupply.toString()).toNumber();
};

export const parsePoolType = (x: string) => {
  return {
    poolType: x,
    curveType: normalizeStructTag(x.split('<')[1].split(',')[0]),
    memeCoinType: normalizeStructTag(x.split('<')[1].split(',')[1].trim()),
    quoteCoinType: normalizeStructTag(
      x.split('<')[1].split(',')[2].trim().slice(0, -1)
    ),
  };
};

export const parseMemezPool = async (
  client: SuiClient,
  objectResponse: SuiObjectResponse
): Promise<MemezPool<PumpState>> => {
  const { poolType, memeCoinType, curveType, quoteCoinType } = parsePoolType(
    pathOr('0x0', ['data', 'content', 'type'], objectResponse)
  );

  const stateId = pathOr(
    '0x0',
    ['data', 'content', 'fields', 'state', 'fields', 'id', 'id'],
    objectResponse
  );

  const dynamicField = await client.getDynamicFields({
    parentId: stateId,
  });

  const dynamicFieldDataId = pathOr('0x0', ['objectId'], dynamicField.data[0]);

  const stateObject = await client.getObject({
    id: dynamicFieldDataId,
    options: { showContent: true },
  });

  const curveState = {
    burnTax: +pathOr(
      0,
      [
        'data',
        'content',
        'fields',
        'constant_product',
        'fields',
        'burner',
        'fee',
        'fields',
        'pos0',
      ],
      stateObject
    ),
    memeBalance: BigInt(
      pathOr(
        0n,
        [
          'data',
          'content',
          'fields',
          'constant_product',
          'fields',
          'meme_balance',
        ],
        stateObject
      )
    ),
    suiBalance: BigInt(
      pathOr(
        0n,
        [
          'data',
          'content',
          'fields',
          'constant_product',
          'fields',
          'sui_balance',
        ],
        stateObject
      )
    ),
    swapFee: +pathOr(
      0,
      [
        'data',
        'content',
        'fields',
        'constant_product',
        'fields',
        'swap_fee',
        'fields',
        'pos0',
        'fields',
        'pos0',
      ],
      stateObject
    ),
    liquidityProvision: BigInt(
      pathOr(
        0n,
        ['data', 'content', 'fields', 'value', 'fields', 'liquidity_provision'],
        stateObject
      )
    ),
    migrationFee: BigInt(
      pathOr(
        0n,
        [
          'data',
          'content',
          'fields',
          'migration_fee',
          'fields',
          'pos0',
          'fields',
          'pos0',
        ],
        stateObject
      )
    ),
    virtualLiquidity: BigInt(
      pathOr(
        0n,
        [
          'data',
          'content',
          'fields',
          'constant_product',
          'fields',
          'virtual_liquidity',
        ],
        stateObject
      )
    ),
    targetSuiLiquidity: BigInt(
      pathOr(
        0n,
        [
          'data',
          'content',
          'fields',
          'constant_product',
          'fields',
          'target_sui_liquidity',
        ],
        stateObject
      )
    ),
    devPurchase: BigInt(
      pathOr(0n, ['data', 'content', 'fields', 'dev_purchase'], stateObject)
    ),
  } as PumpState;

  return {
    objectId: normalizeSuiObjectId(
      pathOr('0x0', ['data', 'objectId'], objectResponse)
    ),
    poolType,
    quoteCoinType,
    memeCoinType,
    curveType,
    usesTokenStandard: pathOr(
      false,
      ['data', 'content', 'fields', 'is_token'],
      objectResponse
    ),
    ipxMemeCoinTreasury: normalizeSuiObjectId(
      pathOr(
        '0x0',
        ['data', 'content', 'fields', 'ipx_meme_coin_treasury'],
        objectResponse
      )
    ),
    metadata: {},
    migrationWitness: normalizeStructTag(
      pathOr(
        '0x0',
        ['data', 'content', 'fields', 'migration_witness', 'fields', 'name'],
        objectResponse
      )
    ),
    dynamicFieldDataId,
    progress: pathOr(
      '0x0',
      ['data', 'content', 'fields', 'progress', 'variant'],
      objectResponse
    ),
    stateId,
    curveState,
  };
};

export const parseMetadata = (objectResponse: SuiObjectResponse) => {
  return pathOr(
    [],
    ['data', 'content', 'fields', 'metadata', 'fields', 'contents'],
    objectResponse
  ).reduce(
    (acc: Record<string, string>, elem: any) => {
      const fields = pathOr({ key: '', value: '' }, ['fields'], elem);

      return {
        ...acc,
        [fields.key]: fields.value,
      };
    },
    {} as Record<string, string>
  );
};
