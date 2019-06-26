import { SET_DICTIONARIES_OWNED_BY_A_USERS_ORGS } from '../../redux/actions/types';
import dictionaryReducer from '../../redux/reducers/dictionaryReducer';
import { setDictionariesOwnedByAUsersOrgs } from '../../redux/actions/user';
import dictionary from '../__mocks__/dictionaries';

describe('dictionaryReducer', () => {
  describe(SET_DICTIONARIES_OWNED_BY_A_USERS_ORGS, () => {
    it('should set the dictionaries to dictionariesOwnedByUsersOrg', () => {
      const expectedDictionaries = [
        dictionary,
      ];
      expect(dictionaryReducer(
        undefined,
        setDictionariesOwnedByAUsersOrgs(expectedDictionaries),
      ).dictionariesOwnedByUsersOrg).toEqual(expectedDictionaries);
    });
  });
});
