import React from 'react';
import { shallow } from 'enzyme';
import ActionButtons from '../../../components/dictionaryConcepts/components/ActionButtons';
import ViewConceptMappings from '../../../components/dictionaryConcepts/components/ViewConceptMappings';

const props = {
  actionButtons: true,
  id: '1',
  concept_class: 'drug',
  version_url: '/url',
  showDeleteModal: jest.fn(),
  mappings: [
    {
      "type": "Mapping",
      "uuid": "8d492ee0-c2cc-11de-8d13-0010c6dffd0f",
      "external_id": "a9d93ffjjen9dnfekd9",
      "map_type": "Same As",
      "from_source_owner": "Regenstrief",
      "from_source_owner_type": "Organization",
      "from_source_name": "loinc2",
      "from_concept_code": "32700-7",
      "from_concept_name": "Malarial Smear",
      "from_source_url": "/orgs/Regenstrief/sources/loinc2/",
      "from_concept_url": "/orgs/Regenstrief/sources/loinc2/concepts/32700-7/",
      "to_source_owner_type": "Organization",
      "to_source_name": "ICPC-2",
      "to_concept_code": "A73",
      "to_concept_name": "Malaria",
      "to_source_url": "/orgs/WHO/sources/ICPC-2/",
      "source": "loinc2",
    },
  ],
};

describe('Test suite for ActionButton', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ActionButtons {...props} />);
  });

  it('should render ActionButton Component', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('should call the showDeleteModal and fetchPreview', () => {
    wrapper.find('#retireConcept').simulate('click');
    expect(props.showDeleteModal).toBeCalled();
  });

  it('should render ViewConceptMappings if mappings is Not null', () => {
    const viewWrapper = wrapper.find(ViewConceptMappings);
    expect(viewWrapper.length).toEqual(1);
  });

  it('should not render viewconceptmappings if mappings is null', () => {
    wrapper.setProps({ mappings: null });
    const viewWrapper = wrapper.find(ViewConceptMappings);
    expect(viewWrapper.length).toEqual(0);
  });
});
