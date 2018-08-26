import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from 'redux-test-utils'
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
  /*const wrapper = shallow(<DictionaryModal {...props} />);
  const preventDefault = { preventDefault: jest.fn() };
  const toUpperCase = { toUpperCase: jest.fn() };
  const then = { then: jest.fn() };

  it('should take a snapshot', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().componentDidMount());
  });
  it('Test to find and click cancel and add dictionary buttons', () => {
    expect(wrapper.find('#cancel').simulate('click'));
    expect(wrapper.find('#addDictionary').simulate('click', preventDefault));
    expect(wrapper.instance().validate(preventDefault));
  });
  it('Tests that the component changes state', () => {
    wrapper.setState({ errors: {} });
    expect(wrapper.state('errors')).toEqual({});
  });

  it('Opens and closes modal on trigger', () => {
    expect(wrapper.find('#cancel').simulate('click'));
  });

  it('Sets the state of the component to the value of the input elements on change', () => {
    wrapper.find('#dictionary_name').simulate('change', { target: { value: 'CIEL', name: 'name' } });
    expect(wrapper.state().data.name).toEqual('CIEL');
  });

  it('Renders component that adds a dictionary', () => {
    const data = {
      dictionary: {
        name: toUpperCase,
        submit: then,
        then: jest.fn(),
      },
    };
    const component = shallow(<AddDictionary {...props} {...preventDefault} {...data} />);
    expect(component).toMatchSnapshot();
  });
  */
});
