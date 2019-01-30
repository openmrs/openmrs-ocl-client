const dictionary = {
  type: 'Collection',
  uuid: '5b23946bc38fb30049835b6a',
  id: 'main',
  short_code: 'main',
  name: 'ChrisMain4567',
  full_name: null,
  preferred_source: '',
  repository_type: 'OpenMRSDictionary',
  custom_resources_linked_source: '',
  description: 'erttt',
  external_id: null,
  collection_type: '',
  custom_validation_schema: null,
  public_access: 'View',
  default_locale: 'en',
  supported_locales: ['en', ' es'],
  website: null,
  url: '/users/chriskala/collections/main/',
  versions_url: '/users/chriskala/collections/main/versions/',
  concepts_url: '/users/chriskala/collections/main/concepts/',
  mappings_url: '/users/chriskala/collections/main/mappings/',
  owner: 'chriskala',
  owner_type: 'User',
  owner_url: '/users/chriskala/',
  versions: 1,
  created_on: '2018-06-15T06:26:51.173',
  updated_on: '2018-06-15T06:26:51.173',
  created_by: 'chriskala',
  updated_by: 'chriskala',
  extras: null,
  references: [],
  active_concepts: 0,
  active_mappings: 0,
};

// Mock more dictionaries objects array
export const mockDictionaries = (() => {
  const dictionaries = [];
  let i = 0;
  while (i <= 60) {
    const newDictionary = { ...dictionary, id: i, uuid: String(i) };
    dictionaries.push(newDictionary);
    i += 1;
  }
  return dictionaries;
})();

export const sampleDictionaries = [
  dictionary,
  {
    ...dictionary,
    uuid: '8883946bc38fb30049835888',
    id: 'main1',
    short_code: 'main1',
    name: 'Main Dictionary 1',
  },
  {
    ...dictionary,
    uuid: '1113946bc38fb30049835111',
    id: 'main2',
    short_code: 'main2',
    name: 'Main Dictionary 2',
  },
];

export default dictionary;
