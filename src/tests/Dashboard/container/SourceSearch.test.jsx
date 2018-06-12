import React from 'react';
import { mount } from 'enzyme';
import Router from 'react-mock-router';
import {
  SourceSearch,
  mapStateToProps,
} from '../../../components/dashboard/container/SourceSearch';
import sources from '../../__mocks__/sources';

describe('Dashboard Component', () => {
  it('should render without any sources data', () => {
    const props = {
      fetchSources: jest.fn(),
      sources: [],
      isFetching: false,
    };
    const wrapper = mount(<Router><SourceSearch {...props} /></Router>);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render preloader spinner', () => {
    const props = {
      fetchSources: jest.fn(),
      sources: [],
      isFetching: true,
    };
    const wrapper = mount(<Router><SourceSearch {...props} /></Router>);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render with sources data', () => {
    const props = {
      fetchSources: jest.fn(),
      sources: [sources],
      isFetching: true,
    };
    const wrapper = mount(<Router><SourceSearch {...props} /></Router>);

    expect(wrapper).toMatchSnapshot();
  });

  it('should filter sources', () => {
    const props = {
      fetchSources: jest.fn(),
      sources: [sources],
      isFetching: false,
      onSubmit: jest.fn(),
      onSearch: jest.fn(),
      sort: jest.fn(),
    };

    const wrapper = mount(<Router><SourceSearch {...props} /></Router>);
    wrapper.find('#dictionary').simulate('click', {
      preventDefault: () => {},
    });

    expect(wrapper).toMatchSnapshot();
  });
  it('should search for a source', () => {
    const props = {
      fetchSources: jest.fn(),
      sources: [sources],
      isFetching: true,
    };
    const wrapper = mount(<Router><SourceSearch {...props} /></Router>);
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
