export const authenticated = {
  users: {
    loggedIn: true,
    isLoggedIn: true,
    payload: {
      type: 'User',
      uuid: '5b02b990ff9616006a51fbea',
      username: 'emasys',
      name: 'Emmanuel Ndukwe',
      email: 'sample@example.com',
      company: null,
      location: null,
      preferred_locale: null,
      orgs: 0,
      public_collections: 0,
      public_sources: 0,
      created_on: '2018-05-21T08:20:32.934',
      updated_on: '2018-05-21T13:30:10.532',
      created_by: 'root',
      updated_by: 'emasys',
      url: '/users/emasys/',
      organizations_url: '/users/emasys/orgs/',
      sources_url: '/users/emasys/sources/',
      collections_url: '/users/emasys/collections/',
      extras: null,
    },
  },
};

export const notAuthenticated = {
  users: {
    isLoggedIn: false,
  },
};
