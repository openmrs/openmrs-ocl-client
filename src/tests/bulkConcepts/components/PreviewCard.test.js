import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router';

import PreviewCard from '../../../components/bulkConcepts/component/PreviewCard';

describe('Test suite for ActionButton in BulkConceptsPage component', () => {
  const props = {
    closeModal: jest.fn(),
    addConcept: jest.fn(),
    open: true,
    concept: {
      display_name: 'lob dev',
      descriptions: [{ description: '' }],
      mappings: null,
      display_locale: 'en',
      concept_class: 'diagnosis',
      datatype: 'coded',
      names: [{ name: 'TEST SYNONYM' }, { name: 'TEST SYNONYM' }],
    },
  };

  it('should render without breaking', () => {
    const wrapper = mount(<Router>
      <PreviewCard {...props} />
    </Router>);
    expect(wrapper.length).toEqual(1);
  });

  it('should render with mappings', () => {
    const newProps = {
      ...props,
      concept: {
        mappings: [
          {
            map_type: 'Mapping',
            to_concept_name: '',
            source: '',
            to_concept_code: '047',
            to_source_name: 'RxNORM',
            to_source_owner: 'NLM',
          },
        ],
        descriptions: [{ description: '' }],
      },
    };
    const wrapper = mount(<Router>
      <PreviewCard {...newProps} />
    </Router>);
    expect(wrapper.length).toEqual(1);
    expect(wrapper.find('Cell').getElement(0).props.original).toEqual(newProps.concept.mappings[0]);
  });

  it('should render with mappings containing set members', () => {
    const newProps = {
      ...props,
      concept: {
        mappings: [
          {
            map_type: 'CONCEPT-SET',
            to_concept_code: '1',
            to_concept_name: 'LIVER FUNCTION TESTS',
            source: '',
          },
        ],
        descriptions: [{ description: '' }],
      },
    };
    const wrapper = mount(<Router>
      <PreviewCard {...newProps} />
    </Router>);
    expect(
      wrapper.find('.synonyms').filterWhere(
        node => node.text() === 'Set members',
      ).length,
    ).toEqual(1);
  });

  it('should render with mappings containing answers', () => {
    const newProps = {
      ...props,
      concept: {
        mappings: [
          {
            map_type: 'Q-AND-A',
            to_concept_code: '1',
            to_concept_name: 'LIVER FUNCTION TESTS',
            source: '',
          },
        ],
        descriptions: [{ description: '' }],
      },
    };
    const wrapper = mount(<Router>
      <PreviewCard {...newProps} />
    </Router>);
    expect(
      wrapper.find('.synonyms').filterWhere(
        node => node.text() === 'Answers',
      ).length,
    ).toEqual(1);
  });

  it('should call handleClick when a link that displays other set members/answers is clicked', () => {
    const newProps = {
      ...props,
      concept: {
        mappings: [
          {
            map_type: 'Q-AND-A',
            to_concept_code: '1',
            to_concept_name: 'LIVER FUNCTION TESTS',
            source: '',
          },
          {
            map_type: 'Q-AND-A',
            to_concept_code: '1566',
            to_concept_name: 'RIFAMPICIN/ISONIAZID PROPHYLAXI',
            source: '',
          },
          {
            map_type: 'Q-AND-A',
            to_concept_code: '1366',
            to_concept_name: 'RIFAMPICIN/ISONIAZID/ETHAMBUTOL PROPHYLAXIS',
            source: 'd3h7d3e4g6d3e4',
          },
          {
            map_type: 'Q-AND-A',
            to_concept_code: '667',
            to_concept_name: 'ISONIAZID PROPHYLAXIS',
            source: 'd3h7d3e4g6d3e4',
          },
          {
            map_type: 'Q-AND-A',
            to_concept_code: '1652',
            to_concept_name: 'RIFAMPICIN/ISONIAZID/ETHAMBUTOL',
            source: 'd3h7d3e4g6d3e4',
          },
          {
            map_type: 'Q-AND-A',
            to_concept_code: '1234',
            to_concept_name: 'PROPHYLAXIS RIFAMPICIN',
            source: 'd3h7d3e4g6d3e4',
          },
        ],
        descriptions: [{ description: '' }],
      },
    };
    const wrapper = mount(<Router>
      <PreviewCard {...newProps} />
    </Router>);
    const cardBody = wrapper.find('CardBody')
      .filterWhere(node => node.props().title === 'Answers').instance();
    const spy = jest.spyOn(cardBody, 'handleClick');
    cardBody.forceUpdate();
    wrapper.find('.showOthers').simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  it('should render on clicks', () => {
    const wrapper = mount(<Router>
      <PreviewCard {...props} />
    </Router>);
    wrapper.find('Button#addConcept').simulate('click');
    expect(props.addConcept).toBeCalled();
  });

  it('should call closeModal function when the close button is clicked', () => {
    const wrapper = mount(<Router>
      <PreviewCard {...props} />
    </Router>);
    wrapper.find('Button#previewModalCloseBtn').simulate('click');
    expect(props.closeModal).toBeCalled();
  });
});
