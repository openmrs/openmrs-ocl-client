import React from 'react';
import { mount } from 'enzyme';
import Router from 'react-mock-router';

import PreviewCard from '../../../components/bulkConcepts/component/PreviewCard';

describe('Test suite for ActionButton in BulkConceptsPage component', () => {
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
        mappings: ['erer', 'fvvv'],
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

    wrapper.find('button.mr-2').simulate('click');
    expect(props.addConcept).toBeCalled();
  });
});
