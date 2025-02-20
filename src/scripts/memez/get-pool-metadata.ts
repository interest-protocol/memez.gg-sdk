import { log, memezTestnet, TEST_POOL_ID } from '../utils.script';

(async () => {
  const r = await memezTestnet.getPoolMetadata({
    poolId: TEST_POOL_ID,
    quoteCoinType: '0x2::sui::SUI',
    memeCoinType:
      '0xa718d2c0c0dcb90f6e4a9b78e1f0f886d9f790e8d1a1471ad44a411a5d63732c::meme::MEME',
    curveType:
      '0x63fed690a1154cfc4b31658443227de047cf3d305179aa5836e177c9efa57854::memez_pump::Pump',
  });

  log(r);
})();
