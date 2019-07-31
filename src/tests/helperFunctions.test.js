import { buildPartialSearchQuery } from '../helperFunctions';
import { findLocale } from '../components/dashboard/components/dictionary/common/Languages';

describe('buildPartialSearchQuery', () => {
  it('adds wildcards before all spaces', () => {
    expect(buildPartialSearchQuery(' ')).toEqual('* ');
    expect(buildPartialSearchQuery('search query')).toEqual('search* query');
  });
});

describe('findLocale', () => {
  it('returns English when it cant find the request locale', () => {
    expect(findLocale('doesNotExist')).toEqual({ value: 'en', label: 'English [en]' });
  });
});
