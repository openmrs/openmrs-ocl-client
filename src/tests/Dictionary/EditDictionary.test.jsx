import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from 'redux-test-utils';
import organizations from '../__mocks__/organizations';
import dictionary from '../__mocks__/dictionaries';
import { EditDictionary } from '../../components/dashboard/components/dictionary/EditDictionary';

const props = {
  title: 'Edit Dictionary',
  buttonname: 'Update Dictionary',
  show: true,
  modalhide: jest.fn(),
  submit: jest.fn(),
  organizations: [organizations],
  dictionary,
  fetchingOrganizations: jest.fn(),
  handleHide: jest.fn(),
  name: jest.fn(),
  editDictionary: jest.fn(),
};

const store = createMockStore({
  organizations: {
    organizations: [organizations],
  },
});

describe('Test suite for Edit Dictionary', () => {
  it('should render EditDictionary', () => {
    const wrapper = shallow(<Provider store={store}><EditDictionary {...props} /></Provider>);
    expect(wrapper).toMatchSnapshot();
  });
});
