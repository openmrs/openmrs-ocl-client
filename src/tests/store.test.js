import { loadState, STORE_VERSION, CURRENT_STORE_VERSION_KEY } from '../redux/reducers/store';

describe('loadState', () => {
  const expectedState = {
    concepts: [1, 2],
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('should return undefined when state is null', () => {
    expect(loadState()).toEqual(undefined);
  });

  describe('should return undefined when store versions don\'t match', () => {
    it('should return undefined when store version in local storage is null', () => {
      localStorage.setItem('state', JSON.stringify(expectedState));
      expect(loadState()).toEqual(undefined);
    });

    it('should return undefined when store versions don\'t match', () => {
      localStorage.setItem(CURRENT_STORE_VERSION_KEY, STORE_VERSION - 1);
      localStorage.setItem('state', JSON.stringify(expectedState));
      const loadedState = loadState();
      expect(loadedState).not.toEqual(expectedState);
      expect(loadedState).toEqual(undefined);
    });
  });

  it('should return the state that was saved when store versions match', () => {
    localStorage.setItem(CURRENT_STORE_VERSION_KEY, STORE_VERSION);
    localStorage.setItem('state', JSON.stringify(expectedState));
    expect(loadState()).toEqual(expectedState);
  });

  it('should not return the saved state when store versions don\'t match', () => {
    localStorage.setItem(CURRENT_STORE_VERSION_KEY, STORE_VERSION - 1);
    localStorage.setItem('state', JSON.stringify(expectedState));
    expect(loadState()).not.toEqual(expectedState);
  });
});
