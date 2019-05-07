import { loadState, STORE_VERSION } from '../redux/reducers/store';

describe('loadState', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return undefined when state is null', () => {
    expect(loadState()).toEqual(undefined);
  });

  describe('should return undefined when store versions don\'t match', () => {
    it('should return undefined when store version in local storage is null', () => {
      localStorage.setItem('state', 'state');
      expect(loadState()).toEqual(undefined);
    });

    it('should return undefined when store versions don\'t match', () => {
      localStorage.setItem('storeVersion', STORE_VERSION - 1);
      localStorage.setItem('state', 'state');
      expect(loadState()).toEqual(undefined);
    });
  });

  it('should return the right state that was saved', () => {
    localStorage.setItem('storeVersion', STORE_VERSION);
    localStorage.setItem('state', JSON.stringify('state'));
    expect(loadState()).toEqual('state');
  });
});
