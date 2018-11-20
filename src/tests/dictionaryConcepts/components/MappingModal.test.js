import React from 'react';
import { mount } from 'enzyme';
import moxios from 'moxios';
import instance from '../../../config/axiosConfig';
import concept, { mockConcepts } from '../../__mocks__/concepts';
import MappingModal from '../../../components/dictionaryConcepts/components/MappingModal';

let wrapper;
let props;

describe('render MappingModal', () => {
  beforeEach(() => {
    moxios.install(instance);
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: mockConcepts,
      });
    });
    props = {
      showModal: true,
      handleHideModal: jest.fn(),
      concept,
      createConceptMapping: jest.fn(() => Promise.resolve(true)),
    };
    wrapper = mount(<MappingModal {...props} />);
  });
  it('should render without breaking', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('should handle change of type', () => {
    const event = {
      target: {
        name: 'type',
        value: 'test',
      },
    };
    wrapper.find('#type').simulate('change', event);
    expect(wrapper.state().type).toBe('test');
  });

  it('should handle entries validation', () => {
    const event = {
      preventDefault: jest.fn(),
    };
    const input = {
      target: {
        name: 'mapType',
        value: 'test',
      },
    };
    wrapper.find('form').simulate('submit', event);
    wrapper
      .find('#mapType')
      .at(0)
      .simulate('change', input);
    wrapper.find('form').simulate('submit', event);
    expect(Object.keys(wrapper.state().errors).length).toBeGreaterThan(0);
  });

  it('should handle internal mapping form submission', () => {
    const event = {
      preventDefault: jest.fn(),
    };
    const input = {
      target: {
        name: 'mapType',
        value: 'same',
      },
    };
    wrapper.instance().setState({ toConceptUrl: concept.url });
    wrapper
      .find('#mapType')
      .at(0)
      .simulate('change', input);
    wrapper.find('form').simulate('submit', event);
    expect(props.createConceptMapping).toHaveBeenCalled();
  });

  it('should handle external mapping form submission', () => {
    const event = {
      preventDefault: jest.fn(),
    };
    const input = {
      target: {
        name: 'mapType',
        value: 'same',
      },
    };
    wrapper.instance().setState({
      toConceptUrl: concept.url,
      toDictionaryUrl: '/dictionary/url',
      type: 'externalMapping',
    });
    wrapper
      .find('#mapType')
      .at(1)
      .simulate('change', input);
    wrapper.find('form').simulate('submit', event);
    expect(props.createConceptMapping).toHaveBeenCalled();
  });

  it('should handle selection of the concept', async () => {
    const asyncData = { name: 'toConceptUrl', value: '/concept/url' };
    wrapper.instance().handleAsyncSelect(asyncData);
    expect(wrapper.state().toConceptUrl).toBe(asyncData.value);
  });

  it('should handle change', () => {
    const event = {
      target: {
        name: 'mapType',
        value: 'test',
      },
    };
    wrapper.instance().handleChange(event);
    expect(wrapper.state().mapType).toBe('test');
  });
});
