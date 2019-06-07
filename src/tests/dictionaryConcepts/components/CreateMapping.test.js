import React from 'react';
import { mount, shallow } from 'enzyme';
import { MemoryRouter as Router } from 'react-router';
import { notify } from 'react-notify-toast';
import moxios from 'moxios';
import CreateMapping from '../../../components/dictionaryConcepts/components/CreateMapping';
import { INTERNAL_MAPPING_DEFAULT_SOURCE, KEY_CODE_FOR_ENTER } from '../../../components/dictionaryConcepts/components/helperFunction';
import concept, { mockSource } from '../../__mocks__/concepts';
import api from '../../../redux/api';
import apiInstance from '../../../config/axiosConfig';
import { externalSource, internalSource } from '../../__mocks__/sources';


describe('Test suite for dictionary concepts components', () => {
  const props = {
    map_type: 'same as',
    sourceObject: internalSource,
    to_concept_code: '674647-75775',
    to_concept_name: 'malaria',
    index: 1,
    updateEventListener: jest.fn(),
    removeMappingRow: jest.fn(),
    updateSourceEventListener: jest.fn(),
    allSources: [mockSource],
    url: 'uniqueMappingUrl',
  };

  let wrapper = mount(<Router>
    <table><tbody><CreateMapping {...props} /></tbody></table>
  </Router>);

  beforeEach(() => {
    moxios.install(apiInstance);
  });

  afterEach(() => {
    moxios.uninstall(apiInstance);
  });

  it('should call updateEventListener', () => {
    const newProps = {
      ...props,
      sourceObject: externalSource,
    };

    wrapper = mount(<Router>
      <table><tbody><CreateMapping {...newProps} /></tbody></table>
    </Router>);

    const inputField = wrapper.find('CreateMapping');
    inputField.find(`#to-concept-name-${props.url}`).simulate('change');
    expect(props.updateEventListener).toHaveBeenCalled();
  });

  it('should call removeMappingRow and remove row', () => {
    const inputField = wrapper.find('CreateMapping');
    inputField.find('#remove').first().simulate('click');
    expect(props.removeMappingRow).toHaveBeenCalled();
  });

  it('should render when isNew is true and source not CIEL', () => {
    const newProps = {
      ...props,
      isNew: true,
    };

    wrapper = mount(<Router>
      <table><tbody><CreateMapping {...newProps} /></tbody></table>
    </Router>);
    const inputs = wrapper.find('input');
    expect(inputs).toHaveLength(1);
  });

  it('should handle update of new mappings row source data when isNew is true', () => {
    const newProps = {
      ...props,
      isNew: true,
    };

    wrapper = mount(<Router>
      <table><tbody><CreateMapping {...newProps} /></tbody></table>
    </Router>);
    const inputField = wrapper.find('CreateMapping');
    inputField.find('#source').simulate('change');
    expect(props.updateSourceEventListener).toHaveBeenCalled();
  });

  it('should handle update of new mappings row data for external concepts when isNew is true', () => {
    const newProps = {
      ...props,
      to_concept_name: null,
      to_concept_code: null,
      isNew: true,
      sourceObject: externalSource,
    };

    wrapper = mount(<Router>
      <table><tbody><CreateMapping {...newProps} /></tbody></table>
    </Router>);
    const inputField = wrapper.find('CreateMapping');
    inputField.find('#to_concept_code').simulate('change');
    expect(props.updateEventListener).toHaveBeenCalled();
  });

  it('should call handleKeyPress when a key is pressed in the internal concepts search input', () => {
    const newProps = {
      ...props,
      isNew: true,
    };

    wrapper = mount(<Router>
      <table><tbody><CreateMapping {...newProps} /></tbody></table>
    </Router>);

    const createMappingRow = wrapper.find('CreateMapping');

    const handleKeyPressSpy = jest.spyOn(createMappingRow.instance(), 'handleKeyPress');

    expect(handleKeyPressSpy).not.toHaveBeenCalled();

    createMappingRow.find(`#to-concept-name-${newProps.url}`).simulate('keyDown');
    expect(handleKeyPressSpy).toHaveBeenCalledTimes(1);
  });

  it('should update the internalConceptSearchQuery prop when a search query is typed', () => {
    const searchQuery = 'query';
    const newProps = {
      ...props,
      isNew: true,
    };

    wrapper = mount(<Router>
      <table><tbody><CreateMapping {...newProps} /></tbody></table>
    </Router>);

    const createMappingRow = wrapper.find('CreateMapping');
    const instance = createMappingRow.instance();

    expect(instance.state.internalConceptSearchQuery).toEqual(props.to_concept_name);

    createMappingRow.find(`#to-concept-name-${newProps.url}`).simulate('change', {
      target: {
        value: searchQuery,
      },
    });
    expect(instance.state.internalConceptSearchQuery).toEqual(searchQuery);
  });

  it('should display a spinner when loading internal concepts', (done) => {
    const newProps = {
      ...props,
      isNew: true,
    };

    wrapper = mount(<Router>
      <table><tbody><CreateMapping {...newProps} /></tbody></table>
    </Router>);

    const createMappingRow = wrapper.find('CreateMapping');
    const instance = createMappingRow.instance();

    expect(wrapper.find('.concept-code .loading')).toHaveLength(0);

    instance.setState({ conceptsLoading: true }, () => {
      wrapper.update();
      expect(wrapper.find('.concept-code .loading')).toHaveLength(1);
      done();
    });
  });

  it('should call action to query internal concepts and set the results to state', async () => {
    const data = [concept];
    const conceptsInASourceMock = jest.fn(() => ({ data }));
    api.concepts.list.conceptsInASource = conceptsInASourceMock;
    const event = {
      keyCode: KEY_CODE_FOR_ENTER,
    };
    const inputValue = 'testQuery';
    const url = '/test/url';
    const newProps = {
      ...props,
    };

    wrapper = mount(<Router>
      <table><tbody><CreateMapping {...newProps} /></tbody></table>
    </Router>);

    const createMapping = wrapper.find('CreateMapping');
    const createMappingInstance = createMapping.instance();

    expect(createMapping.state().internalConceptOptions).toHaveLength(0);
    expect(createMapping.state().isInternalConceptOptionsListVisible).toBeFalsy();

    await createMappingInstance.handleKeyPress(event, inputValue, url, false);

    expect(createMapping.state().internalConceptOptions).toEqual(data);
    expect(createMapping.state().isInternalConceptOptionsListVisible).toBeTruthy();
  });

  it('should notify a user when they try to search with less than three characters', async () => {
    const notifyMock = jest.fn();
    const event = {
      keyCode: KEY_CODE_FOR_ENTER,
    };
    const inputValue = 'te';
    const url = '/test/url';
    const newProps = {
      ...props,
    };

    notify.show = notifyMock;

    wrapper = mount(<Router>
      <table><tbody><CreateMapping {...newProps} /></tbody></table>
    </Router>);
    const createMappingInstance = wrapper.find('CreateMapping').instance();

    expect(notifyMock).not.toHaveBeenCalled();

    await createMappingInstance.handleKeyPress(event, inputValue, url, false);

    expect(notifyMock).toHaveBeenCalledWith('Query must have at least three characters', 'warning', 2000);
  });

  it('should display "No concepts matching this query" when there are no concepts to select from', (done) => {
    const newProps = {
      ...props,
      isNew: true,
    };

    const mappingRow = shallow(<CreateMapping {...newProps} />);

    mappingRow.setState({
      internalConceptOptions: [],
      isInternalConceptOptionsListVisible: true,
    }, () => {
      const message = mappingRow.find('.message');
      expect(message).toHaveLength(1);
      expect(message.text()).toEqual('No concepts matching this query');
      done();
    });
  });

  it('should handle click when a user selects a preferred mapping from the list', (done) => {
    const newProps = {
      ...props,
      isNew: true,
    };

    const mappingRow = shallow(<CreateMapping {...newProps} />);

    mappingRow.setState({
      internalConceptOptions: [concept],
      isInternalConceptOptionsListVisible: true,
    }, () => {
      const conceptOption = mappingRow.find(`#concept-id-${concept.id}`);
      const spy = jest.spyOn(mappingRow.instance(), 'selectInternalMapping');
      expect(spy).not.toHaveBeenCalled();
      conceptOption.simulate('click');
      expect(spy).toHaveBeenCalled();
      done();
    });
  });

  describe('selectInternalMapping', () => {
    it('should call updateEventListener twice with the expected arguments', () => {
      const newProps = {
        ...props,
      };
      const url = '/test/url';

      wrapper = mount(<Router>
        <table><tbody><CreateMapping {...newProps} /></tbody></table>
      </Router>);
      const createMappingInstance = wrapper.find('CreateMapping').instance();
      props.updateEventListener.mockClear();

      expect(props.updateEventListener).not.toHaveBeenCalled();

      createMappingInstance.selectInternalMapping(concept, url);

      expect(props.updateEventListener).toHaveBeenCalledTimes(2);
      expect(props.updateEventListener.mock.calls[0]).toEqual([{
        target: {
          value: `ID(${concept.id}) - ${concept.display_name}`,
          name: 'to_concept_name',
        },
      }, url]);
      expect(props.updateEventListener.mock.calls[1]).toEqual([{
        target: {
          value: concept.id,
          name: 'to_concept_code',
        },
      }, url]);
    });
  });
});
