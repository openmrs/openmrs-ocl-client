import React from 'react';
import { mount } from 'enzyme';
import { SourceSearch } from '../../../components/dashboard/container';
import sources from '../../__mocks__/sources';

describe('Dashboard Component', () => {
  it('should render without any sources data', () => {
    const props = {
      fetchSources: jest.fn(),
      sources: [],
      isFetching: false,
    };
    const wrapper = mount(<SourceSearch {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render preloader spinner', () => {
    const props = {
      fetchSources: jest.fn(),
      sources: [],
      isFetching: true,
    };
    const wrapper = mount(<SourceSearch {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render with sources data', () => {
    const props = {
      fetchSources: jest.fn(),
      sources: [sources],
      isFetching: true,
    };
    const wrapper = mount(<SourceSearch {...props} />);

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

    const wrapper = mount(<SourceSearch {...props} />);

    wrapper.find('#dictionary').simulate('click', {
      preventDefault: () => {},
    });


    expect(wrapper).toMatchSnapshot();
  });

  it('should sort sources', () => {
    const props = {
      fetchSources: jest.fn(),
      sources: [sources],
      isFetching: false,
      onSubmit: jest.fn(),
      onSearch: jest.fn(),
      sort: jest.fn(),
    };

    const wrapper = mount(<SourceSearch {...props} />);

    wrapper.find('#sortAsc').simulate('click', {
      preventDefault: () => {},
    });
    wrapper.find('#sortDesc').simulate('click', {
      preventDefault: () => {},
    });
    wrapper.find('#sort-asc').simulate('click', {
      preventDefault: () => {},
    });
    wrapper.find('#sort-desc').simulate('click', {
      preventDefault: () => {},
    });

    expect(wrapper).toMatchSnapshot();
  });
});
