import React from 'react';
import { shallow } from 'enzyme';
import { DictionaryModal } from '../../components/dashboard/components/dictionary/common/DictionaryModal';
import organizations from '../__mocks__/organizations';
import SideNavigation from '../../components/dashboard/components/SideNavigation';

const props = {
  title: 'Add Dictionary',
  buttonname: 'Add Dictionary',
  show: true,
  modalhide: jest.fn(),
  submit: jest.fn(),
  organizations: [organizations],
  fetchingOrganizations: jest.fn(),
  createDictionary: jest.fn(),
  createDictionaryUser: jest.fn(),
  handleHide: jest.fn(),
  name: jest.fn(),
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
    expect(wrapper.instance().validate(preventDefault));
  });
  it('Tests that the component changes state', () => {
    wrapper.setState({ errors: {} });
    expect(wrapper.state('errors')).toEqual({});
  });

  it('Test to check modal opens and closes on trigger', () => {
    expect(wrapper.find('#cancel').simulate('click'));
    const dictionaryWrapper = shallow(<SideNavigation {...props} />);
    expect(dictionaryWrapper.instance().handleHide(preventDefault));
    expect(dictionaryWrapper.instance().handleShow(preventDefault));
  });
});
