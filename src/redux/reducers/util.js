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
  const x = countBy(list);
  if (x[item] > 1) {
    delete x[item];
  }
  return Object.keys(x);
};
