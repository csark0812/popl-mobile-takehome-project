import * as api from '../api/api';
import * as leadsApi from '../api/leadsApi';

describe('API', () => {
  it('api exports functions', () => {
    expect(api.api).toBeDefined();
    expect(typeof api.api.get).toBe('function');
    expect(typeof api.api.post).toBe('function');
  });
  it('leadsApi exports functions', () => {
    expect(leadsApi.leadsApi.getAll).toBeDefined();
    expect(leadsApi.leadsApi.getById).toBeDefined();
    expect(leadsApi.leadsApi.create).toBeDefined();
    expect(leadsApi.leadsApi.update).toBeDefined();
    expect(leadsApi.leadsApi.delete).toBeDefined();
  });
  it('handles API error', async () => {
    jest.spyOn(api.api, 'get').mockRejectedValueOnce(new Error('fail'));
    await expect(api.api.get('/fail')).rejects.toThrow('fail');
  });
});
