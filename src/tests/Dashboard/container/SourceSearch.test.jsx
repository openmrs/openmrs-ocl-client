import React from 'react';
import { mount, shallow } from 'enzyme';
import {
  SourceSearch,
  mapStateToProps,
} from '../../../components/dashboard/container/SourceSearch';
import sources from '../../__mocks__/sources';

jest.mock('../../../components/dashboard/components/dictionary/AddDictionary');
describe('Dashboard Component', () => {
  it('should render without any sources data', () => {
    const props = {
      fetchSources: jest.fn(),
      fetchingOrganizations: jest.fn(),
      sources: [],
      isFetching: false,
      clearSources: jest.fn(),
      hasMore: false,
    };
    const wrapper = mount(<SourceSearch {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render preloader spinner', () => {
    const props = {
      fetchSources: jest.fn(),
      fetchingOrganizations: jest.fn(),
      sources: [],
      isFetching: true,
      clearSources: jest.fn(),
      hasMore: false,
    };
    const wrapper = mount(<SourceSearch {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render with sources data', () => {
    const props = {
      fetchSources: jest.fn(),
      fetchingOrganizations: jest.fn(),
      sources: [sources],
      isFetching: true,
      clearSources: jest.fn(),
      hasMore: false,
    };
    const wrapper = mount(<SourceSearch {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should filter sources', () => {
    const props = {
      fetchSources: jest.fn(),
      fetchingOrganizations: jest.fn(),
      sources: [sources],
      isFetching: false,
      onSubmit: jest.fn(),
      onSearch: jest.fn(),
      sort: jest.fn(),
      clearSources: jest.fn(),
      hasMore: false,
    };

    const wrapper = mount(<SourceSearch {...props} />);
    wrapper.find('#dictionary').simulate('click', {
      preventDefault: () => {},
    });

    expect(wrapper).toMatchSnapshot();
  });
  it('should search for a source', () => {
    const props = {
      fetchSources: jest.fn(),
      fetchingOrganizations: jest.fn(),
      sources: [sources],
      isFetching: true,
      clearSources: jest.fn(),
      hasMore: false,
    };
    const wrapper = mount(<SourceSearch {...props} />);
    const event = { target: { name: 'searchInput', value: 'ciel' } };
    wrapper.find('#search').simulate('change', event);
    wrapper.find('#dictionary').simulate('click', {
      preventDefault: () => {},
    });

    wrapper.find('.search-bar-wrapper').simulate('submit', {
      preventDefault: () => {},
    });
  });

  it('should test mapStateToProps', () => {
    const initialState = {
      sources: { sources: [], loading: false },
    };
    expect(mapStateToProps(initialState).sources).toEqual([]);
    expect(mapStateToProps(initialState).isFetching).toEqual(false);
  });
});
