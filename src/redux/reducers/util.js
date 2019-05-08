import { countBy } from 'lodash';

export const filterSources = (concepts) => {
  const filteredSources = [];
  if (Array.isArray(concepts)) {
    concepts.map((concept) => {
      if (!filteredSources.includes(concept.source)) {
        return filteredSources.push(concept.source);
      }
      return null;
    });
  }
  return filteredSources;
};

export const filterClass = (concepts) => {
  const filteredClass = [];
  if (Array.isArray(concepts)) {
    concepts.map((concept) => {
      if (!filteredClass.includes(concept.concept_class)) {
        return filteredClass.push(concept.concept_class);
      }
      return null;
    });
  }
  return filteredClass;
};

export const filterList = (item, list) => {
  let filteredList = [];
  if (Array.isArray(list)) {
    if (list.indexOf(item) !== -1) {
      filteredList = list.filter(listItem => listItem !== item);
    } else {
      filteredList = [...list, item];
    }
  }
  return [...filteredList];
};

export const normalizeList = (item, list) => {
  const listItem = countBy(list);
  if (listItem[item] > 1) {
    delete listItem[item];
  }
  return Object.keys(listItem);
};

export const filterNames = (item, list) => list.filter(listItem => listItem !== item);

export const filterPayload = (payload) => {
  const filteredDictionaries = [];
  payload.map((dictionary) => {
    if (dictionary.repository_type === 'OpenMRSDictionary') {
      return filteredDictionaries.push(dictionary);
    }
    return filteredDictionaries;
  });
  return filteredDictionaries;
};

export const filterUserPayload = (user, payload) => {
  const filteredDictionaries = [];
  payload.map((dictionary) => {
    if (dictionary.created_by === user) {
      return filteredDictionaries.push(dictionary);
    }
    return filteredDictionaries;
  });
  return filteredDictionaries;
};

export const filterDescriptions = (item, list) => list.filter(listItem => listItem.uuid !== item);

export const updatePopulatedAnswers = (ans, answers) => {
  const newAnswers = answers.map((item) => {
    if (item.frontEndUniqueKey === ans.frontEndUniqueKey) {
      return ans;
    }
    return item;
  });
  return newAnswers;
};
