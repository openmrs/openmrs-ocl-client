import React from 'react';
import { mount } from 'enzyme';
import expect from 'expect';

import Paginations from '../../../components/bulkConcepts/component/Paginations';

describe('Test suite for concept pagination component', () => {
  it('Should render without breaking', () => {
    const props = {
      concepts: 10,
      indexOfFirstConcept: 1,
      totalConcepts: 20,
      currentPage: 1,
      handleClick: jest.fn(),
      lastPage: 2,
      onChangeLimit: jest.fn(),
    };
    const wrapper = mount(<Paginations {...props} />);
    const selectLimit = wrapper.find('select');
    selectLimit.simulate('change', { target: { value: 50 } });
    const nextPage = wrapper.find('.nxt');
    nextPage.simulate('click');
    expect(wrapper).toMatchSnapshot();
  });
});
