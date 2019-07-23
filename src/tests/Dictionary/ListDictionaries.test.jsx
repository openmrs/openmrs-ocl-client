import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import ListDictionaries from '../../components/dashboard/components/dictionary/ListDictionaries';
import { mockDictionaries } from '../__mocks__/dictionaries';

describe('Test ListDictionary component', () => {
  it('should render without any dictionary data', () => {
    const props = {
      dictionaries: [],
      fetching: false,
    };
    const wrapper = mount(<ListDictionaries {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with dictionary data', () => {
    const props = {
      dictionaries: mockDictionaries,
      fetching: false,
    };
    const wrapper = mount(<MemoryRouter>
      <ListDictionaries {...props} />
    </MemoryRouter>);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render preloader spinner', () => {
    const props = {
      dictionaries: [],
      fetching: true,
    };
    const wrapper = mount(<ListDictionaries {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should display "Search to find Public Dictionaries" if a user has not yet started a search', () => {
    const props = {
      dictionaries: [],
      fetching: false,
      searchHasBeenDone: false,
    };

    const wrapper = mount(<ListDictionaries {...props} />);
    expect(wrapper.find('div.mt-3 h5').text()).toEqual('Search to find Public Dictionaries');
  });
});
