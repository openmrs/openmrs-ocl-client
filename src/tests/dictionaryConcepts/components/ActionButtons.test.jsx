import React from 'react';
import { shallow } from 'enzyme';
import ActionButtons from '../../../components/dictionaryConcepts/components/ActionButtons';

const props = {
  actionButtons: true,
  id: '1',
  concept_class: 'drug',
  version_url: '/url',
  showDeleteModal: jest.fn(),
};

describe('Test suite for ActionButton', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ActionButtons {...props} />);
  });

  it('should render ActionButton Component', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call the showDeleteModal', () => {
    wrapper.find('#retireConcept').simulate('click');
    expect(props.showDeleteModal).toBeCalled();
  });
});
