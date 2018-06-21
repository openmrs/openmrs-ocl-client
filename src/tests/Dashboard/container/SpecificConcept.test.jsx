import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import {
  SpecificConcept,
  mapStateToProps,
} from '../../../components/dashboard/container/SpecificConcept';
import concepts from '../../__mocks__/concepts';

jest.mock('../../../components/dashboard/components/dictionary/AddDictionary');

describe('Dashboard SpecificConcept Component', () => {
  it('should render without crashing', () => {
    const props = {
      fetchConceptsActionTypes: jest.fn(),
      concepts: [],
      isFetching: false,
    };
    const params = {
      match: {
        params: {
          organization: 'owner',
          name: 'name',
        },
      },
    };
    const wrapper = mount(<MemoryRouter>
      <SpecificConcept {...props} match={{ params }} />
    </MemoryRouter>);

    expect(wrapper).toMatchSnapshot();
  });
  it('should render preloader spinner', () => {
    const props = {
      fetchConceptsActionTypes: jest.fn(),
      concepts: [],
      isFetching: true,
    };
    const params = {
      match: {
        params: {
          organization: 'owner',
          name: 'name',
        },
      },
    };
    const wrapper = mount(<MemoryRouter>
      <SpecificConcept {...props} match={{ params }} />
    </MemoryRouter>);

    expect(wrapper).toMatchSnapshot();
  });
  it('should search for a specific concept', () => {
    const props = {
      fetchConceptsActionTypes: jest.fn(),
      concepts: [concepts],
      isFetching: true,
    };
    const params = {
      match: {
        params: {
          organization: 'owner',
          name: 'name',
        },
      },
    };
    const wrapper = mount(<MemoryRouter>
      <SpecificConcept {...props} match={{ params }} />
    </MemoryRouter>);
    const event = { target: { name: 'searchInput', value: 'drug' } };
    wrapper.find('#search').simulate('change', event);
    wrapper.find('.search-bar-wrapper').simulate('submit', {
      preventDefault: () => {},
    });
  });

  it('should test mapStateToProps', () => {
    const initialState = {
      concepts: { concepts: [], loading: false },
    };
    expect(mapStateToProps(initialState).concepts).toEqual([]);
    expect(mapStateToProps(initialState).isFetching).toEqual(false);
  });
  it('should render with specific concepts', () => {
    const props = {
      fetchConceptsActionTypes: jest.fn(),
      concepts: [concepts],
      isFetching: true,
    };
    const params = {
      match: {
        params: {
          organization: 'owner',
          name: 'name',
        },
      },
    };
    const wrapper = mount(<MemoryRouter>
      <SpecificConcept {...props} match={{ params }} />
    </MemoryRouter>);
    expect(wrapper).toMatchSnapshot();
  });
});

