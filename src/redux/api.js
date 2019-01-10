import instance from '../config/axiosConfig';

export default {
  dictionaries: {
    createDictionary: data => instance
      .post(`orgs/${data.owner}/collections/`, data)
    /* eslint-disable */
        .then((response) => { 
          instance.post(`orgs/${data.owner}/sources/`, data);
          return response;
        }),

    createDictionaryUser: data =>
      instance
        .post('user/collections/', data)
        .then((response) => {
          instance.post('user/sources/', data);
          return response;
        }),
    
    editDictionary: (url, data) =>
      instance
        .put(url, data)
        .then(response => response.data),

    fetchingDictionaries: () =>
      instance
      .get(`collections/?q=${''}&limit=${0}&page=${1}&verbose=true`)
      .then(payload => payload.data),
      
    searchDictionaries: (searchTerm) =>
      instance
      .get(`collections/?q=${searchTerm}&limit=${0}&page=${1}&verbose=true`)
      .then(payload => payload.data),

    fetchDictionary: (data) =>
      instance
        .get(`${data}`)
        .then(response => response.data),

    removeDictionaryConcept: (data, type, owner, collectionId) =>
      instance
        .delete(`/${type}/${owner}/collections/${collectionId}/references/`, {data:data})
        .then(response => response.data),

    removeConceptMapping: (data) =>
      instance
        .delete(data.references[0], { data: data })
        .then(response => response.data),

    fetchingVersions: (data) =>
      instance
      .get(`${data}`)
      .then(payload => payload.data),

    fetchDictionaryConcepts: (data) =>
      instance
        .get(`${data}`)
        .then(response => response.data),

    creatingVersion: (url,data) => 
      instance
         .post(`${url}`, data)
         .then(response => response.data),
    
    realisingHeadVersion: (url, data) =>
      instance
        .put(url, data)
        .then(response => response.data),
  },
  organizations: {
    fetchOrganizations: () =>
      instance
        .get(`users/${localStorage.username}/orgs/`)
        .then(response => response.data),
  },
};
