import React from 'react';
import { mount, shallow } from 'enzyme';
import { createMockStore } from 'redux-test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router';

import {
  DictionaryConcepts,
  mapStateToProps,
} from '../../../components/dictionaryConcepts/containers/DictionaryConcepts';
import concepts, { concept3, sampleConcept } from '../../__mocks__/concepts';
import { INTERNAL_MAPPING_DEFAULT_SOURCE } from '../../../components/dictionaryConcepts/components/helperFunction';
import ConceptTable from '../../../components/dictionaryConcepts/components/ConceptTable';

const store = createMockStore({
  organizations: {
    organizations: [],
  },
});

const retireMockProps = {
  retireCurrentConcept: jest.fn(() => sampleConcept),
  recreateConcept: jest.fn(),
  removeConcept: jest.fn(),
  getOriginalConcept: async () => jest.fn(),
  originalConcept: sampleConcept,
  addReferenceToCollection: jest.fn(() => true),
  deleteReferenceFromCollection: jest.fn(() => true),
};

jest.useFakeTimers();

describe('Test suite for dictionary concepts components', () => {
  it('should render component without breaking', () => {
    const props = {
      match: {
        params: {
          typeName: 'dev-col',
          type: 'orgs',
          collectionName: 'dev-col',
          dictionaryName: 'dev-col',
        },
      },
      location: {
        pathname: '/random/path',
      },
      fetchDictionaryConcepts: jest.fn(),
      concepts: [],
      filteredClass: ['Diagnosis'],
      filteredSources: ['CIEL'],
      loading: false,
      conceptsCount: 1,
      totalConceptsCount: 1,
      filterBySource: jest.fn(),
      filterByClass: jest.fn(),
      fetchMemberStatus: jest.fn(),
      paginateConcepts: jest.fn(),
      totalConceptCount: 20,
      userIsMember: true,
      removeDictionaryConcept: jest.fn(),
      removeConceptMappingAction: jest.fn(),
      searchByName: jest.fn(),
      ...retireMockProps,
    };
    const wrapper = mount(<Provider store={store}>
      <Router>
        <DictionaryConcepts {...props} />
      </Router>
    </Provider>);
    expect(wrapper.find('h2.text-capitalize').text()).toEqual('dev-col Dictionary');
    jest.runAllTimers();

    expect(wrapper).toMatchSnapshot();
  });

  it('should contain strikethrough text for retired concepts', () => {
    const props = {
      concepts: [{ ...concepts, retired: true }],
      loading: false,
      org: {},
      locationPath: {},
      showDeleteModal: jest.fn(),
      handleDelete: jest.fn(),
      conceptLimit: 1,
      closeDeleteModal: jest.fn(),
      handleDeleteMapping: jest.fn(),
      showDeleteMappingModal: jest.fn(),
    };
    const wrapper = mount(<ConceptTable {...props} />);
    expect(wrapper).toMatchSnapshot();
    const strikethroughText = wrapper.find('del.text-muted');
    expect(strikethroughText.length).toBeGreaterThan(0);
  });

  describe('ConceptTable', () => {
    it('concept row should display the retire concept button when the collection owner is logged in', () => {
      const props = {
        concepts: [{ ...concepts, retired: false }],
        loading: false,
        org: {},
        locationPath: {},
        showDeleteModal: jest.fn(),
        handleDelete: jest.fn(),
        conceptLimit: 1,
        closeDeleteModal: jest.fn(),
        handleDeleteMapping: jest.fn(),
        showDeleteMappingModal: jest.fn(),
      };

      localStorage.setItem('username', props.concepts[0].owner);
      const wrapper = mount(<Router><ConceptTable {...props} /></Router>);
      expect(wrapper.find('#retire')).toHaveLength(1);
    });

    it('concept row should not display the retire concept button when the collection owner is not logged in', () => {
      const props = {
        concepts: [{ ...concepts, retired: false }],
        loading: false,
        org: {},
        locationPath: {},
        showDeleteModal: jest.fn(),
        handleDelete: jest.fn(),
        conceptLimit: 1,
        closeDeleteModal: jest.fn(),
        handleDeleteMapping: jest.fn(),
        showDeleteMappingModal: jest.fn(),
      };

      localStorage.setItem('username', 'notTheOwner');
      const wrapper = mount(<Router><ConceptTable {...props} /></Router>);
      expect(wrapper.find('#retire')).toHaveLength(0);
    });
  });

  it('should render component without breaking when the type is not specified', () => {
    const props = {
      match: {
        params: {
          typeName: 'dev-col',
          type: '',
          collectionName: 'dev-col',
          dictionaryName: 'dev-col',
        },
      },
      location: {
        pathname: '/random/path',
      },
      fetchDictionaryConcepts: jest.fn(),
      concepts: [],
      filteredClass: ['Diagnosis'],
      filteredSources: ['CIEL'],
      loading: false,
      conceptsCount: 1,
      totalConceptsCount: 1,
      filterBySource: jest.fn(),
      filterByClass: jest.fn(),
      fetchMemberStatus: jest.fn(),
      paginateConcepts: jest.fn(),
      totalConceptCount: 20,
      userIsMember: true,
      removeDictionaryConcept: jest.fn(),
      removeConceptMappingAction: jest.fn(),
      searchByName: jest.fn(),
      ...retireMockProps,
    };
    const wrapper = mount(<Provider store={store}>
      <Router>
        <DictionaryConcepts {...props} />
      </Router>
    </Provider>);
    expect(wrapper.find('h2.text-capitalize').text()).toEqual('dev-col Dictionary');
    jest.runAllTimers();

    expect(wrapper).toMatchSnapshot();
  });

  it('should remove a dictionary concept', () => {
    const props = {
      match: {
        params: {
          typeName: 'dev-col',
          type: 'orgs',
          collectionName: 'dev-col',
          dictionaryName: 'dev-col',
        },
      },
      location: {
        pathname: '/random/path',
      },
      fetchDictionaryConcepts: jest.fn(),
      concepts: [concepts],
      filteredClass: ['Diagnosis'],
      filteredSources: ['1234567876'],
      loading: false,
      totalConceptCount: 11,
      filterBySource: jest.fn(),
      filterByClass: jest.fn(),
      paginateConcepts: jest.fn(),
      fetchMemberStatus: jest.fn(),
      userIsMember: true,
      removeDictionaryConcept: jest.fn(),
      removeConceptMappingAction: jest.fn(),
      searchByName: jest.fn(),
      ...retireMockProps,
    };

    const wrapper = mount(<Provider store={store}>
      <Router>
        <DictionaryConcepts {...props} />
      </Router>
    </Provider>);
    expect(wrapper).toBeDefined();
    wrapper.find('.btn.btn-sm.mb-1.actionButtons').simulate('click');
    expect(wrapper).toMatchSnapshot();
  });

  it('should change open and close delete modal', () => {
    const props = {
      match: {
        params: {
          typeName: 'dev-col',
          type: 'orgs',
          collectionName: 'dev-col',
          dictionaryName: 'dev-col',
        },
      },
      location: {
        pathname: '/random/path',
      },
      fetchDictionaryConcepts: jest.fn(),
      concepts: [concept3],
      filteredClass: ['Diagnosis'],
      filteredSources: ['CIEL'],
      loading: false,
      filterBySource: jest.fn(),
      filterByClass: jest.fn(),
      fetchMemberStatus: jest.fn(),
      paginateConcepts: jest.fn(),
      totalConceptCount: 20,
      userIsMember: true,
      removeDictionaryConcept: jest.fn(),
      removeConceptMappingAction: jest.fn(),
      searchByName: jest.fn(),
      ...retireMockProps,
    };
    const wrapper = shallow(<DictionaryConcepts {...props} />);
    wrapper.setState({ versionUrl: 'url' });
    wrapper.update();
    const instance = wrapper.instance();
    instance.handleShowDelete();
    expect(wrapper.state().openDeleteModal).toBe(true);
    instance.closeDeleteModal();
    expect(wrapper.state().openDeleteModal).toBe(false);
  });

  it('should change open delete mappings modal', () => {
    const props = {
      match: {
        params: {
          typeName: 'dev-col',
          type: 'orgs',
          collectionName: 'dev-col',
          dictionaryName: 'dev-col',
        },
      },
      location: {
        pathname: '/random/path',
      },
      url: '/users/admin/sources/858738987555379984/mappings/5bff9fb3bdfb8801a1702975/',
      fetchDictionaryConcepts: jest.fn(),
      concepts: [concepts],
      filteredClass: ['Diagnosis'],
      filteredSources: ['CIEL'],
      loading: false,
      filterBySource: jest.fn(),
      filterByClass: jest.fn(),
      fetchMemberStatus: jest.fn(),
      paginateConcepts: jest.fn(),
      totalConceptCount: 20,
      userIsMember: true,
      removeDictionaryConcept: jest.fn(),
      removeConceptMappingAction: jest.fn(),
      searchByName: jest.fn(),
      ...retireMockProps,
    };
    const wrapper = shallow(<DictionaryConcepts {...props} />);
    wrapper.setState({ data: { references: [props.url] } });
    wrapper.update();
    const instance = wrapper.instance();
    instance.handleShowDeleteMapping(props.url);
    expect((wrapper.state().data) === { references: [props.url] });
  });

  it('it should call the handle delete function', () => {
    const props = {
      match: {
        params: {
          typeName: 'dev-col',
          type: 'orgs',
          collectionName: 'dev-col',
          dictionaryName: 'dev-col',
        },
      },
      location: {
        pathname: '/random/path',
      },
      fetchDictionaryConcepts: jest.fn(),
      concepts: [concepts],
      filteredClass: ['Diagnosis'],
      filteredSources: ['CIEL'],
      loading: false,
      filterBySource: jest.fn(),
      filterByClass: jest.fn(),
      fetchMemberStatus: jest.fn(),
      paginateConcepts: jest.fn(),
      totalConceptCount: 20,
      userIsMember: true,
      removeDictionaryConcept: jest.fn(),
      removeConceptMappingAction: jest.fn(),
      searchByName: jest.fn(),
      ...retireMockProps,
    };
    const wrapper = shallow(<DictionaryConcepts {...props} />);
    const instance = wrapper.instance();
    expect(instance.handleDelete()).toEqual(undefined);
  });

  it('it should call the handle delete mapping function', () => {
    const props = {
      match: {
        params: {
          typeName: 'dev-col',
          type: 'orgs',
          collectionName: 'dev-col',
          dictionaryName: 'dev-col',
        },
      },
      location: {
        pathname: '/random/path',
      },
      fetchDictionaryConcepts: jest.fn(),
      concepts: [concepts],
      filteredClass: ['Diagnosis'],
      filteredSources: ['CIEL'],
      loading: false,
      filterBySource: jest.fn(),
      filterByClass: jest.fn(),
      fetchMemberStatus: jest.fn(),
      paginateConcepts: jest.fn(),
      totalConceptCount: 20,
      userIsMember: true,
      removeDictionaryConcept: jest.fn(),
      removeConceptMappingAction: jest.fn(),
      handleToggle: jest.fn(),
      showDeleteMappingModal: jest.fn(),
      handleDeleteMapping: jest.fn(),
      searchByName: jest.fn(),
      ...retireMockProps,
    };
    const wrapper = shallow(<DictionaryConcepts {...props} />);
    const instance = wrapper.instance();
    expect(instance.handleDeleteMapping()).toEqual(undefined);
  });

  it('should filter search result', () => {
    const props = {
      match: {
        params: {
          typeName: 'dev-col',
          type: 'orgs',
          collectionName: 'dev-col',
          dictionaryName: 'dev-col',
        },
      },
      location: {
        pathname: '/random/path',
      },
      fetchDictionaryConcepts: jest.fn(),
      concepts: [concepts],
      filteredClass: ['Diagnosis'],
      filteredSources: ['CIEL'],
      loading: false,
      filterBySource: jest.fn(),
      filterByClass: jest.fn(),
      fetchMemberStatus: jest.fn(),
      paginateConcepts: jest.fn(),
      totalConceptCount: 20,
      userIsMember: true,
      removeDictionaryConcept: jest.fn(),
      removeConceptMappingAction: jest.fn(),
      searchByName: jest.fn(),
      ...retireMockProps,
    };
    const wrapper = mount(<Provider store={store}>
      <Router>
        <DictionaryConcepts {...props} />
      </Router>
    </Provider>);
    const sourceEvent = {
      target: {
        name: 'CIEL,source', checked: true, value: 'ciel', type: 'checkbox',
      },
    };
    const classesEvent = {
      target: {
        name: 'diagnosis,classes', checked: true, value: 'diagnosis', type: 'checkbox',
      },
    };
    const dictionaryConceptsWrapper = wrapper.find('DictionaryConcepts').instance();
    const spy = jest.spyOn(dictionaryConceptsWrapper, 'handleSearch');
    dictionaryConceptsWrapper.forceUpdate();
    wrapper.find('#CIEL').simulate('change', sourceEvent);
    wrapper.find('#Diagnosis').simulate('change', classesEvent);
    classesEvent.target.type = undefined;
    wrapper.find('#Diagnosis').simulate('change', classesEvent);
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('should test componentWillReceiveProps', () => {
    const props = {
      match: {
        params: {
          typeName: 'dev-col',
          type: 'orgs',
          collectionName: 'dev-col',
          dictionaryName: 'dev-col',
        },
      },
      location: {
        pathname: '/random/path',
      },
      fetchDictionaryConcepts: jest.fn(),
      concepts: [concepts],
      filteredClass: ['Diagnosis'],
      filteredSources: ['CIEL'],
      loading: false,
      filterBySource: jest.fn(),
      filterByClass: jest.fn(),
      fetchMemberStatus: jest.fn(),
      paginateConcepts: jest.fn(),
      totalConceptCount: 20,
      userIsMember: true,
      removeDictionaryConcept: jest.fn(),
      removeConceptMappingAction: jest.fn(),
      searchByName: jest.fn(),
      ...retireMockProps,
    };
    const app = shallow(<DictionaryConcepts {...props} />);
    const newProps = {
      concepts: [concepts],
    };

    app.setState({ searchInput: 'ciel' });
    app.setProps(newProps);
  });

  it('should test mapStateToProps', () => {
    const initialState = {
      match: {
        params: {
          typeName: 'dev-col',
          type: 'orgs',
          collectionName: 'dev-col',
          dictionaryName: 'dev-col',
        },
      },
      concepts: {
        loading: false,
        dictionaryConcepts: [],
        paginatedConcepts: [],
        filteredSources: [],
        filteredClass: [],
      },
      dictionaries: {
        dictionary: [],
      },
      user: {
        userIsMember: false,
      },
    };
    expect(mapStateToProps(initialState).concepts).toEqual([]);
    expect(mapStateToProps(initialState).filteredClass).toEqual([]);
    expect(mapStateToProps(initialState).filteredSources).toEqual([]);
    expect(mapStateToProps(initialState).loading).toEqual(false);
    expect(mapStateToProps(initialState).dictionaries).toEqual([]);
  });

  it('should update the state with search term on change in the search bar', () => {
    const props = {
      match: {
        params: {
          typeName: 'dev-col',
          type: 'orgs',
          collectionName: 'dev-col',
          dictionaryName: 'dev-col',
        },
      },
      location: {
        pathname: '/random/path',
      },
      fetchDictionaryConcepts: jest.fn(),
      concepts: [],
      filteredClass: ['Diagnosis'],
      filteredSources: [INTERNAL_MAPPING_DEFAULT_SOURCE],
      loading: false,
      conceptsCount: 1,
      totalConceptsCount: 1,
      filterBySource: jest.fn(),
      filterByClass: jest.fn(),
      fetchMemberStatus: jest.fn(),
      paginateConcepts: jest.fn(),
      totalConceptCount: 20,
      userIsMember: true,
      removeDictionaryConcept: jest.fn(),
      removeConceptMappingAction: jest.fn(),
      searchByName: jest.fn(),
      ...retireMockProps,
    };
    const wrapper = mount(<Provider store={store}>
      <Router>
        <DictionaryConcepts {...props} />
      </Router>
    </Provider>);
    let event = { target: { name: 'searchInput', value: 'testing' } };
    wrapper.find('#search-concept').simulate('change', event);
    expect(wrapper.find('DictionaryConcepts').state().searchInput).toEqual('testing');
    event = { target: { name: 'searchInput', value: '' } };
    wrapper.find('#search-concept').simulate('change', event);
    expect(wrapper.find('DictionaryConcepts').state().searchInput).toEqual('');
  });

  it('should call the search function when search form is submitted', () => {
    const props = {
      match: {
        params: {
          typeName: 'dev-col',
          type: 'orgs',
          collectionName: 'dev-col',
          dictionaryName: 'dev-col',
        },
      },
      location: {
        pathname: '/random/path',
      },
      fetchDictionaryConcepts: jest.fn(),
      concepts: [],
      filteredClass: ['Diagnosis'],
      filteredSources: [INTERNAL_MAPPING_DEFAULT_SOURCE],
      loading: false,
      conceptsCount: 1,
      totalConceptsCount: 1,
      filterBySource: jest.fn(),
      filterByClass: jest.fn(),
      fetchMemberStatus: jest.fn(),
      paginateConcepts: jest.fn(),
      totalConceptCount: 20,
      userIsMember: true,
      removeDictionaryConcept: jest.fn(),
      removeConceptMappingAction: jest.fn(),
      searchByName: jest.fn(),
      ...retireMockProps,
    };
    const wrapper = mount(<Provider store={store}>
      <Router>
        <DictionaryConcepts {...props} />
      </Router>
    </Provider>);
    props.fetchDictionaryConcepts.mockClear();
    expect(wrapper.find('DictionaryConcepts').props().fetchDictionaryConcepts).not.toHaveBeenCalled();
    wrapper.find('#submit-search-form').simulate('submit');
    expect(wrapper.find('DictionaryConcepts').props().fetchDictionaryConcepts).toHaveBeenCalled();
  });

  describe('Retire/Unretire Concepts', () => {
    let props;
    let wrapper;

    beforeEach(() => {
      props = {
        match: {
          params: {
            collectionName: 'MULAGO',
            dictionaryName: 'Mulago Hospital',
            language: 'en',
            type: 'users',
            typeName: 'admin',
          },
        },
        location: {
          pathname: '/concepts/users/admin/MULAGO/Mulago Hospital/en',
        },
        fetchDictionaryConcepts: jest.fn(),
        concepts: [sampleConcept],
        filteredClass: [],
        filteredSources: [],
        loading: false,
        conceptsCount: 1,
        totalConceptsCount: 1,
        filterBySource: jest.fn(),
        filterByClass: jest.fn(),
        fetchMemberStatus: jest.fn(),
        paginateConcepts: jest.fn(),
        totalConceptCount: 20,
        userIsMember: true,
        removeDictionaryConcept: jest.fn(),
        removeConceptMappingAction: jest.fn(),
        searchByName: jest.fn(),
        ...retireMockProps,
      };
      wrapper = mount(<Provider store={store}>
        <Router>
          <DictionaryConcepts {...props} />
        </Router>
      </Provider>);
    });

    it('should call the handleRetireConcept method when retiring', () => {
      const dictionaryConcepts = wrapper.find('DictionaryConcepts');
      const container = dictionaryConcepts.instance();
      const spy = jest.spyOn(container, 'handleRetireConcept');
      dictionaryConcepts.setState({ isOwner: true }, () => {
        wrapper.find('button#retire').simulate('click');
        expect(spy).toHaveBeenCalled();
      });
    });

    it('should call the handleRetireConcept method when un-retiring', () => {
      const retired = true;
      const newProps = {
        ...props,
        concepts: [{ ...sampleConcept, retired }],
        originalConcept: { ...props.originalConcept, retired },
      };
      wrapper = mount(<Provider store={store}>
        <Router>
          <DictionaryConcepts {...newProps} />
        </Router>
      </Provider>);
      const dictionaryConcepts = wrapper.find('DictionaryConcepts');
      const container = dictionaryConcepts.instance();
      const spy = jest.spyOn(container, 'handleRetireConcept');
      dictionaryConcepts.setState({ isOwner: true }, () => {
        wrapper.find('button#unRetire').simulate('click');
        expect(spy).toHaveBeenCalled();
      });
    });

    it('should call handleRetireConcept without crashing when owner_url is invalid', () => {
      const newProps = {
        ...props,
        concepts: [{ ...sampleConcept, owner_url: '' }],
        originalConcept: { ...props.originalConcept, owner_url: '' },
      };
      wrapper = mount(<Provider store={store}>
        <Router>
          <DictionaryConcepts {...newProps} />
        </Router>
      </Provider>);
      const dictionaryConcepts = wrapper.find('DictionaryConcepts');
      const container = dictionaryConcepts.instance();
      const spy = jest.spyOn(container, 'handleRetireConcept');
      dictionaryConcepts.setState({ isOwner: true }, () => {
        wrapper.find('button#retire').simulate('click');
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('handleRetireConcept', () => {
      let instance;
      let concept;
      let retire;
      beforeEach(() => {
        instance = wrapper.find('DictionaryConcepts').instance();
        retireMockProps.retireCurrentConcept.mockClear();
        retireMockProps.addReferenceToCollection.mockClear();
        retireMockProps.deleteReferenceFromCollection.mockClear();
        [concept] = props.concepts;
        retire = true;
      });

      it('should call retireCurrentConcept, deleteReferenceFromCollection and addReferenceToCollection with the right arguments', async () => {
        await instance.handleRetireConcept(concept.id, retire);
        expect(retireMockProps.retireCurrentConcept).toHaveBeenCalledWith(concept.url, retire);
        expect(retireMockProps.deleteReferenceFromCollection).toHaveBeenCalledWith(
          props.match.params.type,
          props.match.params.typeName,
          props.match.params.collectionName,
          [concept.version_url],
        );
        expect(retireMockProps.addReferenceToCollection).toHaveBeenCalledWith(
          props.match.params.type,
          props.match.params.typeName,
          props.match.params.collectionName,
          [concept.url],
        );
      });

      it('should not call deleteReferenceFromCollection and addReferenceToCollection when retire fails', async () => {
        const newProps = {
          ...props,
          retireCurrentConcept: () => false,
        };
        wrapper = mount(<Provider store={store}>
          <Router>
            <DictionaryConcepts {...newProps} />
          </Router>
        </Provider>);
        instance = wrapper.find('DictionaryConcepts').instance();
        await instance.handleRetireConcept(concept.id, retire);
        expect(retireMockProps.deleteReferenceFromCollection).not.toHaveBeenCalled();
        expect(retireMockProps.addReferenceToCollection).not.toHaveBeenCalled();
      });

      it('should return false and doesn\'t call addReferenceToCollection when deleteReferenceFromCollection fails', async () => {
        const newProps = {
          ...props,
          deleteReferenceFromCollection: () => false,
        };
        wrapper = mount(<Provider store={store}>
          <Router>
            <DictionaryConcepts {...newProps} />
          </Router>
        </Provider>);
        instance = wrapper.find('DictionaryConcepts').instance();
        const result = await instance.handleRetireConcept(concept.id, retire);
        expect(result).toEqual(false);
        expect(retireMockProps.addReferenceToCollection).not.toHaveBeenCalled();
      });

      it('should return false when addReferenceToCollection fails', async () => {
        retire = false;
        const newProps = {
          ...props,
          addReferenceToCollection: () => false,
        };
        wrapper = mount(<Provider store={store}>
          <Router>
            <DictionaryConcepts {...newProps} />
          </Router>
        </Provider>);
        instance = wrapper.find('DictionaryConcepts').instance();
        const result = await instance.handleRetireConcept(concept.id, retire);
        expect(result).toEqual(false);
      });
    });
  });
});
