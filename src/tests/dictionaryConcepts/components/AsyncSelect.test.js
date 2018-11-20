import React from 'react';
import { shallow } from 'enzyme';
import moxios from 'moxios';
import { mockConcepts } from '../../__mocks__/concepts';
import instance from '../../../config/axiosConfig';
import AsyncSelect from '../../../components/dictionaryConcepts/components/AsyncSelect';

const props = {
  onChange: jest.fn(),
  name: 'toConceptUrl',
  sourceUrl: '/url/to/fetch/concepts',
  valueKey: 'url',
  labelKey: 'display_name',
};
const wrapper = shallow(<AsyncSelect {...props} />);

describe('AsyncSelectComponent', () => {
  beforeEach(() => {
    moxios.install(instance);
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: mockConcepts,
      });
    });
    afterEach(() => {
      moxios.uninstall(instance);
    });
  });

  it('mounts without breaking', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('loads and filters options', async () => {
    const spy = jest.spyOn(wrapper.instance(), 'filterOptions');
    const mockCallback = jest.fn();
    wrapper.update();
    await wrapper.instance().loadOptions('pnemonia', mockCallback);
    expect(spy).toHaveBeenCalled();
  });

  it('removes spaces in input text', () => {
    const removeSpace = wrapper.instance().handleInputChange('tsetse fly');
    expect(removeSpace).toBe('tsetsefly');
  });

  it('handles input change', () => {
    const data = {
      label: 'pnemonia',
      value: '/concept/url',
    };
    wrapper.instance().handleOnChange(data);
    expect(props.onChange).toHaveBeenCalled();
  });
});

describe('AsyncSelectComponent', () => {
  beforeEach(() => {
    moxios.install(instance);
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: mockConcepts,
      });
    });
    afterEach(() => {
      moxios.uninstall(instance);
    });
  });

  it('loads and filters options', async () => {
    const spy = jest.spyOn(wrapper.instance(), 'filterOptions');
    const mockCallback = jest.fn();
    wrapper.update();
    await wrapper.instance().loadOptions('pnemonia', mockCallback);
    expect(spy).toHaveBeenCalled();
  });
});
