import React from 'react';
import { Provider } from 'react-redux';
import { createMockStore } from 'redux-test-utils';
import { MemoryRouter } from 'react-router-dom';
import { mount, shallow } from 'enzyme';
import { DictionaryOverview } from '../../components/dashboard/components/dictionary/DictionaryContainer';
import dictionary from '../__mocks__/dictionaries';
import DictionaryDetailCard from '../../components/dashboard/components/dictionary/DictionaryDetailCard';
import versions, { customVersion, HeadVersion } from '../__mocks__/versions';

const store = createMockStore({
  organizations: {
    organizations: [],
  },
  sources: {
    sources: [],
  },
});

jest.mock('../../components/dashboard/components/dictionary/AddDictionary');
describe('DictionaryOverview', () => {
  it('should render without any data', () => {
    const props = {
      dictionary: [],
      versions: [],
    };
    const wrapper = (
      <MemoryRouter>
        <DictionaryOverview {...props} />
      </MemoryRouter>
    );
    expect(wrapper).toMatchSnapshot();
  });
  it('should render with dictionary data for overview', () => {
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
    const wrapper = mount(<Provider store={store}>
      <MemoryRouter>
        <DictionaryOverview {...props} />
      </MemoryRouter>
    </Provider>);
    expect(wrapper.find('#headingDict')).toHaveLength(1);
    expect(wrapper.find('.paragraph')).toHaveLength(5);
    expect(wrapper.find('tr')).toHaveLength(2);
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle HEAD version release', () => {
    const props = {
      dictionary: [dictionary],
      versions: [customVersion],
      dictionaryConcepts: [dictionary],
      isReleased: false,
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
      releaseHead: jest.fn(),
    };

    const wrapper = mount(<Provider store={store}>
      <MemoryRouter>
        <DictionaryOverview {...props} />
      </MemoryRouter>
    </Provider>);
    const spy = jest.spyOn(wrapper.find('DictionaryOverview').instance(), 'handleRelease');
    wrapper.instance().forceUpdate();
    wrapper.find('.fas.fa-cloud-upload-alt.head').simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should handle componentWillUpdate in HEAD version release', () => {
    const props = {
      dictionary: [dictionary],
      versions: [customVersion],
      dictionaryConcepts: [dictionary],
      isReleased: false,
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
      releaseHead: jest.fn(),
    };
    const wrapper = mount(<Provider store={store}>
      <MemoryRouter>
        <DictionaryOverview {...props} />
      </MemoryRouter>
    </Provider>);
    const newProps = {
      dictionary: [dictionary],
      versions: [HeadVersion],
      match: {
        params: {
          ownerType: 'testing',
          owner: 'tester',
          type: 'collection',
          name: 'chris',
        },
      },
      isReleased: true,
      fetchVersions: jest.fn(),
    };
    wrapper.setProps(newProps);
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
    const wrapper = mount(<Provider store={store}>
      <MemoryRouter>
        <DictionaryOverview {...props} />
      </MemoryRouter>
    </Provider>);
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
    const wrapper = shallow(<MemoryRouter>
      <DictionaryOverview {...props} />
    </MemoryRouter>);
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle opening of subscription modal', () => {
    const props = {
      dictionary: { dictionary },
      versions: [versions, customVersion],
      headVersion: [versions],
      url: '',
      dictionaryConcepts: [],
      showEditModal: jest.fn(),
      hideSubModal: jest.fn(),
      showSubModal: jest.fn(),
      handleRelease: jest.fn(),
      match: {
        params: {
          ownerType: 'testing',
          owner: 'chriskala',
          type: 'collection',
          name: 'chriskala',
        },
      },
      fetchDictionary: jest.fn(),
      fetchVersions: jest.fn(),
      fetchDictionaryConcepts: jest.fn(),
    };

    const wrapper = mount(<Provider store={store}><MemoryRouter>
      <DictionaryOverview {...props} />
    </MemoryRouter></Provider>);
    const spy = jest.spyOn(wrapper.find('DictionaryOverview').instance(), 'handleShowSub');
    wrapper.instance().forceUpdate();
    expect(wrapper.find('.subscription-link').at(0).exists()).toBe(true);
    wrapper.find('.subscription-link').at(0).simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should handle a new version release', () => {
    const props = {
      dictionary: [dictionary],
      versions: [customVersion],
      dictionaryConcepts: [dictionary],
      isReleased: false,
      hideVersionModal: jest.fn(),
      showVersionModal: jest.fn(),
      error: false,
      inputLength: 4,
      match: {
        params: {
          ownerType: 'users',
          owner: 'nesh',
          type: 'collection',
          name: 'test',
        },
      },
      fetchDictionary: jest.fn(),
      fetchVersions: jest.fn(),
      fetchDictionaryConcepts: jest.fn(),
      releaseHead: jest.fn(),
      createVersion: jest.fn(() => Promise.resolve(true)),
    };
    const event = {
      preventDefault: jest.fn(),
      target: {
        value: 'v2.0',
        name: 'versionId',
      },
    };

    const wrapper = mount(<Provider store={store}>
      <MemoryRouter><DictionaryOverview {...props} /></MemoryRouter></Provider>);
    const spy = jest.spyOn(wrapper.find('DictionaryOverview').instance(), 'handleCreateVersion');
    wrapper.find('.fas.fa-cloud-upload-alt.version').simulate('click');
    wrapper.find('#versionId').at(0).simulate('change', event);
    wrapper.find('.btn-sm.btn-outline-info.version').at(0).simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should handleChange', () => {
    const props = {
      dictionary: [dictionary],
      versions: [customVersion],
      dictionaryConcepts: [dictionary],
      isReleased: false,
      hideVersionModal: jest.fn(),
      showVersionModal: jest.fn(),
      error: null,
      match: {
        params: {
          ownerType: 'testing',
          owner: 'chriskala',
          type: 'collection',
          name: 'chris',
        },
      },
      fetchDictionary: jest.fn(),
      fetchVersions: jest.fn(),
      fetchDictionaryConcepts: jest.fn(),
      releaseHead: jest.fn(),
      createVersion: jest.fn(),
    };
    const event = {
      preventDefault: jest.fn(),
      target: {
        value: 'v2.0',
        name: 'versionId',
      },
    };
    const wrapper = mount(<Provider store={store}>
      <MemoryRouter><DictionaryOverview {...props} /></MemoryRouter></Provider>);
    const spy = jest.spyOn(wrapper.find('DictionaryOverview').instance(), 'handleChange');
    wrapper.find('.fas.fa-cloud-upload-alt.version').simulate('click');
    wrapper.find('#versionId').at(0).simulate('change', event);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
