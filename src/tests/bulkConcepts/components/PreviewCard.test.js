import React from 'react';
import { mount } from 'enzyme';
import expect from 'expect';
import Router from 'react-mock-router';

import PreviewCard from '../../../components/bulkConcepts/component/PreviewCard';

describe('Test suite for ActionButton in BulkConceptsPage component', () => {
  it('should render without breaking', () => {
    const props = {
      closeModal: jest.fn(),
      addConcept: jest.fn(),
      concept: {
        display_name: 'lob dev',
        descriptions: [{ description: '' }],
        mappings: null,
        display_locale: 'en',
      },
    };
    const wrapper = mount(<Router>
      <PreviewCard {...props} />
    </Router>);
    expect(wrapper).toMatchSnapshot();
    wrapper.find('#add-concept').simulate('click');
  });
});
