import React from 'react';
import { mount } from 'enzyme';
import Router from 'react-mock-router';

import PreviewCard from '../../../components/bulkConcepts/component/PreviewCard';

describe('Test suite for ActionButton in BulkConceptsPage component', () => {
  const props = {
    closeModal: jest.fn(),
    addConcept: jest.fn(),
    open: true,
    concept: {
      display_name: 'lob dev',
      descriptions: [{ description: '' }],
      mappings: null,
      display_locale: 'en',
      concept_class: 'diagnosis',
      datatype: 'coded',
    },
  };

  it('should render without breaking', () => {
    const wrapper = mount(<Router>
      <PreviewCard {...props} />
    </Router>);
    expect(wrapper.length).toEqual(1);
  });

  it('should render with mappings', () => {
    const newProps = {
      ...props,
      concept: {
        mappings: [
          {
            map_type: '',
            to_concept_name: '',
            source: '',
            to_concept_code: '',
          },
        ],
        descriptions: [{ description: '' }],
      },
    };
    const wrapper = mount(<Router>
      <PreviewCard {...newProps} />
    </Router>);
    expect(wrapper.length).toEqual(1);
  });

  it('should render on clicks', () => {
    const wrapper = mount(<Router>
      <PreviewCard {...props} />
    </Router>);
    wrapper.find('Button#addConcept').simulate('click');
    expect(props.addConcept).toBeCalled();
  });

  it('should call closeModal function when the close button is clicked', () => {
    const wrapper = mount(<Router>
      <PreviewCard {...props} />
    </Router>);
    wrapper.find('Button#previewModalCloseBtn').simulate('click');
    expect(props.closeModal).toBeCalled();
  });
});
