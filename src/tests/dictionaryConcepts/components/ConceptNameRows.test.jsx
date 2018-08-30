import React from 'react';
import { shallow } from 'enzyme';
import ConceptNameRows from '../../../components/dictionaryConcepts/components/ConceptNameRows';

const props = {
  pathName: {
    language: 'en',
  }
};

describe('Test suite for ConceptNameRows ', () => {
  it('should render ConceptNameRows  Component', () => {
    const wrapper = shallow(<ConceptNameRows {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
