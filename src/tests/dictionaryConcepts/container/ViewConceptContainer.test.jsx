import { shallow } from 'enzyme';
import React from 'react';
import { ViewConceptContainer } from '../../../components/dictionaryConcepts/containers/ViewConceptContainer';
import concept from '../../__mocks__/concepts';
import mapping from '../../__mocks__/mappings';

const props = {
  loading: false,
  concept,
  fetchExistingConcept: jest.fn(),
  history: {},
  match: { url: '/test/url/' },
};

describe('ViewConceptContainer', () => {
  beforeEach(() => {
    props.fetchExistingConcept.mockClear();
  });

  it('should fetch the concept when the component mounts', () => {
    expect(props.fetchExistingConcept).not.toHaveBeenCalled();
    shallow(<ViewConceptContainer {...props} />);
    expect(props.fetchExistingConcept).toHaveBeenCalledWith(`${props.match.url}?verbose=true&includeMappings=true`);
  });

  it('should fetch the concept on update when the concept url changes', () => {
    const instance = shallow(<ViewConceptContainer {...props} />).instance();

    props.fetchExistingConcept.mockClear();
    instance.componentDidUpdate({ match: { url: '/different/url/' } });
    expect(props.fetchExistingConcept).toHaveBeenCalledWith(`${props.match.url}?verbose=true&includeMappings=true`);
  });

  it('should not re-fetch the concept on update when the concept url does not change', () => {
    const instance = shallow(<ViewConceptContainer {...props} />).instance();

    props.fetchExistingConcept.mockClear();
    instance.componentDidUpdate({ match: { url: props.match.url } });
    expect(props.fetchExistingConcept).not.toHaveBeenCalled();
  });

  it('should display a loader when loading is true', () => {
    const newProps = { ...props, loading: true };
    const viewConceptContainer = shallow(<ViewConceptContainer {...newProps} />);
    expect(viewConceptContainer.exists('Loader')).toBeTruthy();
  });

  it('should display the ViewConcept component when loading is false', () => {
    const newProps = {
      ...props,
      loading: false,
      concept: { ...props.concept, mappings: [mapping] },
    };
    const viewConceptContainer = shallow(<ViewConceptContainer {...newProps} />);
    expect(viewConceptContainer.exists('ViewConcept')).toBeTruthy();
  });
});
