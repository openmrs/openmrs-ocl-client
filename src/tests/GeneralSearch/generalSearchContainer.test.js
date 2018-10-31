import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import { GeneralSearchContainer } from '../../components/GeneralSearch/GeneralSearchContainer';
import dictionaries from '../__mocks__/dictionaries';

describe('GeneralSearchContainer', () => {
  it('should render without any data', () => {
    const props = {
      dictionaries: [dictionaries],
      match: {
        params: {
          query: '',
        },
      },
      generalSearch: jest.fn(),
      loading: false,
    };
    const wrapper = <MemoryRouter><GeneralSearchContainer {...props} /></MemoryRouter>;
    expect(wrapper).toMatchSnapshot();
  });
  it('should render with results', () => {
    const props = {
      dictionaries: [dictionaries],
      match: {
        params: {
          query: 'ChrisMain4567',
        },
      },
      generalSearch: jest.fn(),
      loading: false,
    };
    const wrapper = mount(<MemoryRouter><GeneralSearchContainer {...props} /></MemoryRouter>);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('.dashboard-wrapper')).toHaveLength(1);
  });
  it('should render preloader spinner', () => {
    const props = {
      dictionaries: [dictionaries],
      match: {
        params: {
          query: 'ChrisMain4567',
        },
      },
      generalSearch: jest.fn(),
      loading: true,
    };
    const wrapper = mount(<MemoryRouter><GeneralSearchContainer {...props} /></MemoryRouter>);
    expect(wrapper).toMatchSnapshot();
  });
  it('should render with results', () => {
    const props = {
      dictionaries: [],
      match: {
        params: {
          query: 'ChrisMain4567',
        },
      },
      generalSearch: jest.fn(),
      loading: false,
    };
    const wrapper = mount(<MemoryRouter><GeneralSearchContainer {...props} /></MemoryRouter>);
    expect(wrapper).toMatchSnapshot();
  });
});
