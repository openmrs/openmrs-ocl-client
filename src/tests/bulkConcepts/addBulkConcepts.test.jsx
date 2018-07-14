import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import AddBulkConcepts from '../../components/bulkConcepts/addBulkConcepts';

describe('Add Bulk Concepts', () => {
  it('Should render without crashing', () => {
    const wrapper = mount(<MemoryRouter><AddBulkConcepts /></MemoryRouter>);
    expect(wrapper).toMatchSnapshot();
  });
});

