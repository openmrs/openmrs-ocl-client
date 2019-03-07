import React from 'react';
import { shallow, mount } from 'enzyme';
import {
  DictionaryModal,
} from '../../components/dashboard/components/dictionary/common/DictionaryModal';
import organizations from '../__mocks__/organizations';
import dictionary from '../__mocks__/dictionaries';

const props = {
  title: 'Add Dictionary',
  buttonname: 'Add Dictionary',
  show: true,
  modalhide: jest.fn(),
  submit: jest.fn(() => Promise.resolve('success')),
  organizations: [],
  fetchingOrganizations: jest.fn(),
  fetchSources: jest.fn(),
  createDictionary: jest.fn(),
  createDictionaryUser: jest.fn(),
  handleHide: jest.fn(),
  name: jest.fn(),
  dictionary,
  sources: [{ name: 'source', id: '1' }],
  dictionaries: [],
  userDictionaries: [],
  searchDictionaries: jest.fn(),
};

describe('Test suite for dictionary modal', () => {
  const wrapper = shallow(<DictionaryModal {...props} />);
  const preventDefault = { preventDefault: jest.fn() };

  it('should take a snapshot', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().componentDidMount());
  });
  it('Test to find and click cancel and add dictionary buttons', () => {
    expect(wrapper.find('#cancel').simulate('click'));
    expect(wrapper.find('#addDictionary').simulate('click', preventDefault));
    expect(wrapper.instance().validate(wrapper.state().data));
  });
  it('Tests that the component changes state', () => {
    wrapper.setState({ errors: {} });
    expect(wrapper.state('errors')).toEqual({});
  });

  it('Opens and closes modal on trigger', () => {
    expect(wrapper.find('#cancel').simulate('click'));
  });

  it('Sets the state of the component to the value of the input elements on change', () => {
    wrapper
      .find('#dictionary_name')
      .simulate('change', { target: { value: 'CIEL', name: 'name' } });
    expect(wrapper.state().data.name).toEqual('CIEL');
  });

  it('Sets state to owner on change', () => {
    const newProps = {
      ...props,
      organizations: [organizations],
    };
    const wrap = shallow(<DictionaryModal {...newProps} />);
    wrap
      .find('#dictionary_name')
      .simulate('change', { target: { value: 'CIEL', name: 'name' } });
    expect(wrap.state().data.name).toEqual('CIEL');
  });

  it('it should handle change of supported locales option', () => {
    const otherLanguagesSelect = wrapper.find('#supported_locales');
    expect(otherLanguagesSelect.length).toEqual(1);
    otherLanguagesSelect.simulate('change', [{ value: 'fr', label: 'French [fr]' }]);
    expect(wrapper.state().data.supported_locales).toEqual('fr');
  });

  it('it should render when editing dictionary', () => {
    props.isEditingDictionary = true;
    const editDictionaryModal = shallow(<DictionaryModal {...props} />);
    expect(editDictionaryModal).toMatchSnapshot();
  });

  it('it should handle validations errors on submit', () => {
    wrapper.setState({
      data: {
        ...wrapper.state().data,
        preferred_source: '',
        default_locale: '',
        supported_locales: '',
        public_access: '',
      },
    });
    const submitButtonWrapper = wrapper.find('#addDictionary');
    expect(submitButtonWrapper.length).toEqual(1);
    submitButtonWrapper.simulate('click', preventDefault);
    expect(wrapper.state().errors.preferred_source).toEqual('Required');
    expect(wrapper.state().errors.default_locale).toEqual('Required');
    expect(wrapper.state().errors.public_access).toEqual('Required');
    expect(
      wrapper.state().errors.supported_locales,
    ).toEqual('Preferred language must not be included in other languages');
  });

  it('it should handle submit', async () => {
    wrapper.setState({
      data: {
        ...wrapper.state().data,
        id: '1',
        preferred_source: 'CIEL',
        public_access: 'None',
        name: 'OpenMRSDictionary',
        owner: 'OpenMRS',
        description: 'OpenMRSDictionary',
        default_locale: 'en',
        supported_locales: 'us',
        repository_type: 'OpenMRSDictionary',
      },
    });
    const submitButtonWrapper = wrapper.find('#addDictionary');
    const spy = jest.spyOn(wrapper.instance().props, 'modalhide');
    submitButtonWrapper.simulate('click', preventDefault);
    expect(spy).toHaveBeenCalled();
  });

  it('it should handle submit for an individual alone', async () => {
    wrapper.setState({
      data: {
        ...wrapper.state().data,
        id: '1',
        preferred_source: 'CIEL',
        public_access: 'None',
        name: 'OpenMRSDictionary',
        owner: 'indiviual',
        description: 'OpenMRSDictionary',
        default_locale: 'en',
        supported_locales: 'us',
        repository_type: 'OpenMRSDictionary',
      },
    });
    const submitButtonWrapper = wrapper.find('#addDictionary');
    const spy = jest.spyOn(wrapper.instance().props, 'modalhide');
    submitButtonWrapper.simulate('click', preventDefault);
    expect(spy).toHaveBeenCalled();
  });

  it('it should handle submit error response', async () => {
    const error = {
      response: {},
    };

    const newProps = {
      title: 'Add Dictionary',
      buttonname: 'Add Dictionary',
      show: true,
      modalhide: jest.fn(),
      submit: jest.fn().mockImplementation(() => Promise.reject(error)),
      organizations: [],
      fetchingOrganizations: jest.fn(),
      fetchSources: jest.fn(),
      createDictionary: jest.fn(),
      createDictionaryUser: jest.fn(),
      handleHide: jest.fn(),
      name: jest.fn(),
      dictionary,
      sources: [{ name: 'source', id: '1' }],
      dictionaries: [],
      userDictionaries: [],
      searchDictionaries: jest.fn(),
    };
    const wrapper3 = shallow(<DictionaryModal {...newProps} />);

    wrapper3.setState({
      data: {
        ...wrapper3.state().data,
        id: '1',
        preferred_source: 'CIEL',
        public_access: 'None',
        name: 'OpenMRSDictionary',
        owner: 'indiviual',
        description: 'OpenMRSDictionary',
        default_locale: 'en',
        supported_locales: 'us',
        repository_type: 'OpenMRSDictionary',
      },
      errors: {},
    });

    await wrapper3.instance().onSubmit(preventDefault);
    expect(wrapper3.instance().state.errors).toEqual({});
  });

  it('it should handle undefined submit error response', async () => {
    const error = {
      response: undefined,
    };

    const newProps = {
      title: 'Add Dictionary',
      buttonname: 'Add Dictionary',
      show: true,
      modalhide: jest.fn(),
      submit: jest.fn().mockImplementation(() => Promise.reject(error)),
      organizations: [],
      fetchingOrganizations: jest.fn(),
      fetchSources: jest.fn(),
      createDictionary: jest.fn(),
      createDictionaryUser: jest.fn(),
      handleHide: jest.fn(),
      name: jest.fn(),
      dictionary,
      sources: [{ name: 'source', id: '1' }],
      dictionaries: [],
      userDictionaries: [],
      searchDictionaries: jest.fn(),
    };
    const wrapper3 = shallow(<DictionaryModal {...newProps} />);

    wrapper3.setState({
      data: {
        ...wrapper3.state().data,
        id: '1',
        preferred_source: 'CIEL',
        public_access: 'None',
        name: 'OpenMRSDictionary',
        owner: 'indiviual',
        description: 'OpenMRSDictionary',
        default_locale: 'en',
        supported_locales: 'us',
        repository_type: 'OpenMRSDictionary',
      },
      errors: {},
    });

    await wrapper3.instance().onSubmit(preventDefault);
    expect(wrapper3.instance().state.errors).toEqual({});
  });

  it('it should handle search input values', () => {
    props.isEditingDictionary = false;
    const wrapper2 = mount(<DictionaryModal {...props} />);
    const spy = jest.spyOn(wrapper2.find('DictionaryModal').instance(), 'searchInputValues');
    wrapper2.find('input#react-select-3-input')
      .simulate('change');
    expect(spy).toHaveBeenCalledTimes(1);
    wrapper2.instance().searchInputValues('dictionary');
    expect(props.searchDictionaries).toBeCalled();
  });

  it('it should handle dictionary copying', () => {
    const item = {
      value: '123',
    };
    wrapper.find('#copy_dictionary').simulate('change', item);
  });

  it('it should disable button if there is no error', () => {
    wrapper.setState({
      data: {
        ...wrapper.state().data,
        id: '1',
        preferred_source: 'CIEL',
        public_access: 'None',
        name: 'OpenMRSDictionary',
        owner: 'OpenMRS',
        description: 'OpenMRSDictionary',
        default_locale: 'en',
        supported_locales: 'us',
        repository_type: 'OpenMRSDictionary',
      },
    });
    const submitButtonWrapper = wrapper.find('#addDictionary');
    submitButtonWrapper.simulate('click', preventDefault);
    expect(wrapper.state().disableButton).toBeTruthy();
  });
});
