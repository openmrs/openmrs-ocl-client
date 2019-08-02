import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ViewConcept from '../components/ViewConcept';
import { MAP_TYPE } from '../components/helperFunction';
import { fetchExistingConcept } from '../../../redux/actions/concepts/dictionaryConcepts';
import Loader from '../../Loader';


export class ViewConceptContainer extends Component {
  static propTypes = {
    concept: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    fetchExistingConcept: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { fetchExistingConcept: fetchConcept, match: { url } } = this.props;
    fetchConcept(`${url}?verbose=true&includeMappings=true`);
  }

  componentDidUpdate(prevProps) {
    const { match: { url: previousUrl } } = prevProps;
    const { fetchExistingConcept: fetchConcept, match: { url: currentUrl } } = this.props;
    if (previousUrl !== currentUrl) {
      fetchConcept(`${currentUrl}?verbose=true&includeMappings=true`);
    }
  }

  render() {
    const {
      concept,
      loading,
      history,
    } = this.props;
    const mappings = concept.mappings ? concept.mappings : [];

    const qaMappings = mappings.filter(mapping => mapping.map_type === MAP_TYPE.questionAndAnswer);
    const setMappings = mappings.filter(mapping => mapping.map_type === MAP_TYPE.conceptSet);
    const otherMappings = mappings.filter(
      mapping => mapping.map_type !== MAP_TYPE.questionAndAnswer
        && mapping.map_type !== MAP_TYPE.conceptSet,
    );

    if (loading) {
      return (
        <div className="text-center mt-3" id="loader">
          <Loader />
        </div>
      );
    }

    return (
      <div className="container create-custom-concept">
        <div className="row create-concept-header">
          <div className="backLink">
            <i className="fas fa-arrow-left">
              &nbsp;
              <span className="no-wrap" onClick={history.goBack}>
                Go back
              </span>
            </i>
          </div>
          <div className="col-lg-12">
            <h3>
              {concept.display_name}
              <br />
            </h3>
          </div>
        </div>
        <div className="concept-form-wrapper">
          <div className="row form-container">
            <div className="col-lg-12 col-md-10 col-sm-12">
              <ViewConcept
                concept={concept}
                qaMappings={qaMappings}
                setMappings={setMappings}
                otherMappings={otherMappings}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  concept: state.concepts.existingConcept,
  loading: state.concepts.loading,
});

const mapDispatchToProps = {
  fetchExistingConcept,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewConceptContainer);
