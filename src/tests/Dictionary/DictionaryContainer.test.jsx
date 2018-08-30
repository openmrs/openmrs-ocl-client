import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount, shallow } from 'enzyme';
import { DictionaryOverview } from '../../components/dashboard/components/dictionary/DictionaryContainer';
import dictionary from '../__mocks__/dictionaries';
import versions from '../__mocks__/versions';

jest.mock('../../components/dashboard/components/dictionary/AddDictionary');
describe('DictionaryOverview', () => {
  it('should render without any data', () => {
    const props = {
      dictionary: [],
      versions: [],
    };
    const wrapper = <MemoryRouter><DictionaryOverview {...props} /></MemoryRouter>;
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with dictionary data', () => {
    const props = {
      dictionary: [dictionary],
      versions: [versions],
      dictionaryConcepts: [dictionary],
      match: {
        params: {
          ownerType: 'testing',
          owner: 'tester',
          type: 'collection',
          name: 'chris',
        },
      },
      fetchDictionary: jest.fn(),
      fetchVersions: jest.fn(),
      fetchDictionaryConcepts: jest.fn(),
    };
    const wrapper = mount(<MemoryRouter><DictionaryOverview {...props} /></MemoryRouter>);
    expect(wrapper.find('#headingDict')).toHaveLength(1);
    expect(wrapper.find('.paragraph')).toHaveLength(5);
    expect(wrapper.find('tr')).toHaveLength(2);
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render dictionary versions', () => {
    const props = {
      dictionary: [dictionary],
      versions: [],
      dictionaryConcepts: [],
      match: {
        params: {
          ownerType: 'testing',
          owner: 'tester',
          type: 'collection',
          name: 'chris',
        },
      },
      fetchDictionary: jest.fn(),
      fetchVersions: jest.fn(),
      fetchDictionaryConcepts: jest.fn(),
    };
    const wrapper = mount(<MemoryRouter><DictionaryOverview {...props} /></MemoryRouter>);
    expect(wrapper.find('.version-msg')).toHaveLength(1);
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
