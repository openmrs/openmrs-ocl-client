import React from 'react';
import { mount } from 'enzyme';
import ListDictionaries from '../../components/dashboard/components/dictionary/ListDictionaries';
import dictionaries from '../__mocks__/dictionaries';

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
      dictionaries,
      fetching: false,
    };
    const wrapper = mount(<ListDictionaries {...props} />);
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
});
