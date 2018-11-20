import React from 'react';
import { shallow } from 'enzyme';
import ActionButtons from '../../../components/dictionaryConcepts/components/ActionButtons';
import ViewConceptMappings from '../../../components/dictionaryConcepts/components/ViewConceptMappings';
import concept from '../../__mocks__/concepts';

const props = {
  actionButtons: true,
  showDeleteModal: jest.fn(),
  handleShowMappingModal: jest.fn(),
  concept,
};

describe('Test suite for ActionButton', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ActionButtons {...props} />);
  });

  it('should render ActionButton Component', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('should call the showDeleteModal and fetchPreview', () => {
    wrapper.find('#retireConcept').simulate('click');
    expect(props.showDeleteModal).toBeCalled();
  });

  it('should render ViewConceptMappings if mappings is Not null', () => {
    const viewWrapper = wrapper.find(ViewConceptMappings);
    expect(viewWrapper.length).toEqual(1);
  });

  it('should not render viewconceptmappings if mappings is null', () => {
    wrapper.setProps({ concept: { ...concept, mappings: null } });
    const viewWrapper = wrapper.find(ViewConceptMappings);
    expect(viewWrapper.length).toEqual(0);
  });

  it('should handle opening mapping modal', () => {
    wrapper.find('#mapConcept').simulate('click');
    expect(props.handleShowMappingModal).toBeCalled();
  });
});
