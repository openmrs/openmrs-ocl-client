import { filterClass, filterList, filterSources } from '../../../redux/reducers/util';

const arg = 'arg';

describe('filterSources', () => {
  it('should return an empty list if its argument is not an array', () => {
    expect(filterSources(arg)).toEqual([]);
  });
});

describe('filterClass', () => {
  it('should return an empty list if its argument is not an array', () => {
    expect(filterClass(arg)).toEqual([]);
  });
});

describe('filterList', () => {
  it('should return an empty list if its argument is not an array', () => {
    expect(filterList(arg)).toEqual([]);
  });
});
