import React from 'react';
import { mount, shallow } from 'enzyme';
import { MemoryRouter as Router } from 'react-router';
import { notify } from 'react-notify-toast';
import CreateMapping from '../../../components/dictionaryConcepts/components/CreateMapping';
import { INTERNAL_MAPPING_DEFAULT_SOURCE, KEY_CODE_FOR_ENTER } from '../../../components/dictionaryConcepts/components/helperFunction';
import concept, { mockSource } from '../../__mocks__/concepts';
import api from '../../../redux/api';


describe('Test suite for dictionary concepts components', () => {
  const props = {
    map_type: 'same as',
    source: INTERNAL_MAPPING_DEFAULT_SOURCE,
    to_concept_code: '674647-75775',
    to_concept_name: 'malaria',
    index: 1,
    updateEventListener: jest.fn(),
    removeMappingRow: jest.fn(),
    updateAsyncSelectValue: jest.fn(),
    allSources: [mockSource],
  };

  let wrapper = mount(<Router>
    <table><tbody><CreateMapping {...props} /></tbody></table>
  </Router>);

  it('should call handleInputChange', () => {
    const instance = wrapper.find('CreateMapping').instance();
    instance.handleInputChange('malaria');
  });

  it('should call updateEventListener', () => {
    const newProps = {
      ...props,
      source: 'SNOMED',
    };

    wrapper = mount(<Router>
      <table><tbody><CreateMapping {...newProps} /></tbody></table>
    </Router>);

    const inputField = wrapper.find('CreateMapping');
    inputField.find('#searchInputNotCiel').simulate('change');
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
      source: 'Snomed',
    };

    wrapper = mount(<Router>
      <table><tbody><CreateMapping {...newProps} /></tbody></table>
    </Router>);
    const inputs = wrapper.find('input');
    expect(inputs).toHaveLength(2);
  });

  it('should render when isNew is true and source equal to CIEL', () => {
    const newProps = {
      ...props,
      isNew: true,
    };

    wrapper = mount(<Router>
      <table><tbody><CreateMapping {...newProps} /></tbody></table>
    </Router>);
    const inputs = wrapper.find('select');
    expect(inputs).toHaveLength(2);
  });

  it('should handle update of new mappings row source data when isNew is true', () => {
    const newProps = {
      ...props,
      to_concept_name: 'malaria',
      isNew: true,
    };

    wrapper = mount(<Router>
      <table><tbody><CreateMapping {...newProps} /></tbody></table>
    </Router>);
    const inputField = wrapper.find('CreateMapping');
    inputField.find('#source').simulate('change');
    expect(props.updateEventListener).toHaveBeenCalled();
  });

  it('should handel update of new mappings row data for non Ciel concepts when isNew is true', () => {
    const newProps = {
      ...props,
      isNew: true,
      source: 'Classes',
    };

    wrapper = mount(<Router>
      <table><tbody><CreateMapping {...newProps} /></tbody></table>
    </Router>);
    const inputField = wrapper.find('CreateMapping');
    inputField.find('#to_concept_code').simulate('change');
    expect(props.updateEventListener).toHaveBeenCalled();
  });

  it('should handle update of new mappings row concept name for Ciel concepts when isNew is true', () => {
    const newProps = {
      ...props,
      isNew: true,
      source: 'maptypes',
    };

    wrapper = mount(<Router>
      <table><tbody><CreateMapping {...newProps} /></tbody></table>
    </Router>);
    const inputField = wrapper.find('CreateMapping');
    inputField.find('#ConceptName').simulate('change');
    expect(props.updateEventListener).toHaveBeenCalled();
  });

  it('should call handleKeyPress when a key is pressed in the concept name input', () => {
    const newProps = {
      ...props,
      isNew: true,
      source: 'maptypes',
    };

    wrapper = mount(<Router>
      <table><tbody><CreateMapping {...newProps} /></tbody></table>
    </Router>);

    const createMappingRow = wrapper.find('CreateMapping');

    const handleKeyPressSpy = jest.spyOn(createMappingRow.instance(), 'handleKeyPress');

    expect(handleKeyPressSpy).not.toHaveBeenCalled();

    createMappingRow.find('#ConceptName').simulate('keyDown');
    createMappingRow.find('#to_concept_code').simulate('keyDown');
    expect(handleKeyPressSpy).toHaveBeenCalledTimes(2);
  });

  it('should handle change when a user inputs concept name mappings data for for existing concepts', () => {
    const newProps = {
      ...props,
      source: INTERNAL_MAPPING_DEFAULT_SOURCE,
    };

    wrapper = mount(<Router>
      <table><tbody><CreateMapping {...newProps} /></tbody></table>
    </Router>);

    const inputField = wrapper.find('CreateMapping');
    const spy = jest.spyOn(inputField.instance(), 'handleInputChange');
    inputField.find('#searchInputCiel').simulate('change');
    expect(spy).toHaveBeenCalled();
  });

  it('should handle change when a user inputs concept name mappings data for new rows when isNew is true', () => {
    const newProps = {
      ...props,
      source: INTERNAL_MAPPING_DEFAULT_SOURCE,
      isNew: true,
    };

    wrapper = mount(<Router>
      <table><tbody><CreateMapping {...newProps} /></tbody></table>
    </Router>);

    const inputField = wrapper.find('CreateMapping');
    const spy = jest.spyOn(inputField.instance(), 'handleInputChange');
    inputField.find('#searchInputCielIsnew').simulate('change');
    expect(spy).toHaveBeenCalled();
  });

  it('Should handle key down event when a user presses the enter button to search mappings for existing rows', () => {
    const newProps = {
      ...props,
      source: INTERNAL_MAPPING_DEFAULT_SOURCE,
    };

    wrapper = mount(<Router>
      <table><tbody><CreateMapping {...newProps} /></tbody></table>
    </Router>);

    const inputField = wrapper.find('CreateMapping');
    const spy = jest.spyOn(inputField.instance(), 'handleKeyPress');
    const event = { key: 'Space' };
    inputField.find('#searchInputCiel').simulate('keyDown', event);
    expect(spy).toHaveBeenCalled();
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
      source: INTERNAL_MAPPING_DEFAULT_SOURCE,
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
      source: INTERNAL_MAPPING_DEFAULT_SOURCE,
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
      source: 'maptypes',
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
      source: 'maptypes',
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

  it('Should handle click event when a user click to select a prefered concept name for existing rows', () => {
    const newProps = {
      ...props,
      source: INTERNAL_MAPPING_DEFAULT_SOURCE,
      isNew: false,
      isShown: true,
    };

    wrapper = mount(<table><tbody><CreateMapping {...newProps} /></tbody></table>);

    const inputField = wrapper.find('CreateMapping');
    inputField.setState({
      options: [{
        index: '1',
        label: 'mala',
        value: '/orgs/CIEL/sources/CIEL/concepts/32/',
      }],
    }, () => {
      const spy = jest.spyOn(inputField.instance(), 'handleSelect');
      wrapper.find('#selectMappingnotNew').simulate('click');
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should handle click when a user click to select a prefered concept mapping name for new rows', () => {
    const newProps = {
      ...props,
      source: INTERNAL_MAPPING_DEFAULT_SOURCE,
      isNew: true,
      isShown: true,
    };

    wrapper = mount(<table><tbody><CreateMapping {...newProps} /></tbody></table>);

    const inputField = wrapper.find('CreateMapping');
    inputField.setState({
      options: [{
        index: '1',
        label: 'mala',
        value: '/orgs/CIEL/sources/CIEL/concepts/32/',
      }],
    }, () => {
      const spy = jest.spyOn(inputField.instance(), 'handleSelect');
      wrapper.find('#selectMappingNew').simulate('click');
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should handle key down event when a user presses the enter button to search mappings for existing rows', (done) => {
    const newProps = {
      ...props,
      source: INTERNAL_MAPPING_DEFAULT_SOURCE,
    };

    wrapper = mount(<Router>
      <table><tbody><CreateMapping {...newProps} /></tbody></table>
    </Router>);

    const inputField = wrapper.find('CreateMapping');
    const spy = jest.spyOn(inputField.instance(), 'handleKeyPress');
    const event = { keyCode: KEY_CODE_FOR_ENTER };
    inputField.find('#searchInputCiel').simulate('keyDown', event);
    inputField.instance().handleKeyPress(event, 'malaria').then(() => {
      expect(spy).toHaveBeenCalled();
      done();
    });
  });

  it('should handle key down event when a user presses the enter button to search mappings for new rows (isNew is true)', async () => {
    const newProps = {
      ...props,
      source: INTERNAL_MAPPING_DEFAULT_SOURCE,
      isNew: true,
    };

    wrapper = mount(<Router>
      <table><tbody><CreateMapping {...newProps} /></tbody></table>
    </Router>);

    const inputField = wrapper.find('CreateMapping');
    const spy = jest.spyOn(inputField.instance(), 'handleKeyPress');
    const event = { keyCode: KEY_CODE_FOR_ENTER };
    inputField.find('#searchInputCielIsnew').simulate('keyDown', event);
    await inputField.instance().handleKeyPress(event, 'malaria');
    expect(spy).toHaveBeenCalled();
  });

  describe('selectInternalMapping', () => {
    it('should call updateEventListener twice with the expected arguments', () => {
      const newProps = {
        ...props,
        source: INTERNAL_MAPPING_DEFAULT_SOURCE,
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
          value: concept.display_name,
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
