import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from 'redux-test-utils';
import organizations from '../__mocks__/organizations';
import dictionary, { mockDictionaries } from '../__mocks__/dictionaries';
import { EditDictionary } from '../../components/dashboard/components/dictionary/EditDictionary';

const props = {
  show: true,
  dictionary,
  handleHide: jest.fn(),
  editDictionary: jest.fn(),
};

const store = createMockStore({
  organizations: {
    organizations: [organizations],
  },
  fetchDictionaries: jest.fn(),
  dictionaries: {
    dictionaries: mockDictionaries,
    loading: true,
  },
  user: {
    userDictionary: [],
  },
});

describe('Test suite for Edit Dictionary', () => {
  it('should render EditDictionary', () => {
    const wrapper = mount(<Provider store={store}><EditDictionary {...props} /></Provider>);
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle submit', () => {
    const data = {
      owner: 'Individual',
    };
    const wrapper = mount(<Provider store={store}><EditDictionary {...props} /></Provider>);

    wrapper.find(EditDictionary).instance().submit(data);
    expect(props.editDictionary).toHaveBeenCalledWith('/users/chriskala/collections/main/', { owner: 'Individual' });
  });
});
