import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router';
import CreateMapping from '../../../components/dictionaryConcepts/components/CreateMapping';
import { INTERNAL_MAPPING_DEFAULT_SOURCE, KEY_CODE_FOR_ENTER } from '../../../components/dictionaryConcepts/components/helperFunction';
import { mockSource } from '../../__mocks__/concepts';


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

  it('should handle key down event when a user presses the enter button to search mappings for existing rows', async (done) => {
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
});
