import React from 'react';
import { shallow } from 'enzyme';
import ActionButtons from '../../../components/bulkConcepts/component/ActionButtons';

describe('Test suite for ActionButton in BulkConceptsPage component', () => {
  it('should handle fetchPreview', () => {
    const props = {
      previewConcept: jest.fn(),
      id: '',
      params: {
        type: '',
        typeName: '',
        collectionName: '',
      },
      preview: {
        url: '',
        display_name: '',
      },
      addConcept: jest.fn(),
    };

    const wrapper = shallow(<ActionButtons {...props} />);

    const spy = jest.spyOn(wrapper.instance(), 'fetchPreview');

    wrapper.find('#preview').simulate('click');
    expect(spy).toBeCalled();
  });
});
