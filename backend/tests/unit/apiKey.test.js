const { generateRawKey } = require('../../src/modules/api-keys/service');

describe('API key generation', () => {
  it('produces af_<env>_<prefix>_<secret> format', () => {
    const { raw, keyPrefix, keyHash } = generateRawKey('production');
    expect(raw).toMatch(/^af_live_[a-f0-9]{12}_[a-f0-9]{48}$/);
    expect(raw.startsWith(keyPrefix)).toBe(true);
    expect(keyHash).toHaveLength(64);
  });

  it('uses the test tag for non-production environments', () => {
    const { raw } = generateRawKey('development');
    expect(raw).toMatch(/^af_test_/);
  });

  it('produces different keys each time', () => {
    const a = generateRawKey('development');
    const b = generateRawKey('development');
    expect(a.raw).not.toBe(b.raw);
    expect(a.keyHash).not.toBe(b.keyHash);
  });
});
