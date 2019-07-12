import { buildPartialSearchQuery } from '../helperFunctions';

describe('buildPartialSearchQuery', () => {
  it('adds wildcards before all spaces', () => {
    expect(buildPartialSearchQuery(' ')).toEqual('* ');
    expect(buildPartialSearchQuery('search query')).toEqual('search* query');
  });
});
