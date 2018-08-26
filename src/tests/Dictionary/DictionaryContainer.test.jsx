import React from 'react';
import { Provider } from 'react-redux';
import { createMockStore } from 'redux-test-utils'
import { MemoryRouter } from 'react-router-dom';
import { mount, shallow } from 'enzyme';
import { DictionaryOverview } from '../../components/dashboard/components/dictionary/DictionaryContainer';
import dictionary from '../__mocks__/dictionaries';

const store = createMockStore({
  organizations: {
    organizations: [],
  },
});
jest.mock('../../components/dashboard/components/dictionary/AddDictionary');
describe('DictionaryOverview', () => {
  it('should render without any data', () => {
    const props = {
      dictionary: [],
    };
    const wrapper = <MemoryRouter><DictionaryOverview {...props} /></MemoryRouter>;
    expect(wrapper).toMatchSnapshot();
  });
  it('should render with dictionary data', () => {
    const props = {
      dictionary: [dictionary],
      match: {
        params: {
          ownerType: 'testing',
          owner: 'tester',
          type: 'collection',
          name: 'chris',
        },
      },
      fetchDictionary: jest.fn(),
    };
    const wrapper = mount(<Provider store={store}><MemoryRouter><DictionaryOverview {...props} /></MemoryRouter></Provider>);
    expect(wrapper.find('#headingDict')).toHaveLength(1);
    expect(wrapper.find('.paragraph')).toHaveLength(5);
    expect(wrapper).toMatchSnapshot();
  });
  it('should render preloader spinner', () => {
    const props = {
      fetchDictionary: jest.fn(),
      dictionary: [dictionary],
      loader: true,
      match: {
        params: {
          ownerType: 'testing23',
          owner: 'tester43',
          name: 'chrisman',
          type: 'collection',
        },
      },
    };
    const wrapper = shallow(<MemoryRouter><DictionaryOverview {...props} /></MemoryRouter>);
    expect(wrapper).toMatchSnapshot();
  });
});
