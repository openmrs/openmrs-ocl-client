import React from 'react';
import { mount } from 'enzyme';
import AddConceptModal from '../../../components/dashboard/components/concepts/ConceptModal';

describe('Concept Modal', () => {
  it('should render without crushing', () => {
    const wrapper = mount(<AddConceptModal />);
    expect(wrapper).toMatchSnapshot();
  });
});
