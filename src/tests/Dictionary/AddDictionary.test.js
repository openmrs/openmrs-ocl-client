import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from 'redux-test-utils';
import organizations from '../__mocks__/organizations';
import { mockDictionaries } from '../__mocks__/dictionaries';
import { AddDictionary } from '../../components/dashboard/components/dictionary/AddDictionary';

const props = {
  show: true,
  createDictionary: jest.fn(),
  handleHide: jest.fn(),
  createDictionaryUser: jest.fn().mockImplementation(() => Promise.resolve()),
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
  createDictionary: jest.fn(),
  createDictionaryUser: jest.fn(),
});

describe('Test suite for Edit Dictionary', () => {
  it('should render EditDictionary', () => {
    const wrapper = mount(<Provider store={store}><AddDictionary {...props} /></Provider>);
    expect(wrapper.length).toEqual(1);
  });

  it('should correctly create a collection belonging to a user', () => {
    const username = 'Individual';
    localStorage.setItem('username', username);

    props.createDictionaryUser.mockClear();
    const data = {
      owner: username,
    };
    const wrapper = mount(<Provider store={store}><AddDictionary {...props} /></Provider>);

    expect(props.createDictionaryUser).not.toHaveBeenCalled();

    wrapper.find(AddDictionary).instance().submit(data);

    expect(props.createDictionaryUser).toHaveBeenCalled();
  });

  it('should handle submit from anywhere', async (done) => {
    const data = {
      owner: '',
    };

    const newProps = {
      show: true,
      createDictionary: jest.fn().mockImplementation(() => Promise.resolve()),
      handleHide: jest.fn(),
      createDictionaryUser: jest.fn(),
    };
    const wrapper = mount(<Provider store={store}><AddDictionary {...newProps} /></Provider>);

    await wrapper.find(AddDictionary).instance().submit(data);

    expect(newProps.createDictionary).toHaveBeenCalled();
    expect(newProps.handleHide).toHaveBeenCalled();
    done();
  });
});
