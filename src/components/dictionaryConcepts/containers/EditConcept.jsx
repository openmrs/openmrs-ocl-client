import React, { Component } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import { notify } from 'react-notify-toast';
import PropTypes from 'prop-types';
import uid from 'uuid/v4';
import CreateConceptForm from '../components/CreateConceptForm';
import {
  createNewName,
  removeNewName,
  addNewDescription,
  removeDescription,
  clearSelections,
  fetchExistingConcept,
  updateConcept,
  addDescriptionForEditConcept,
  removeDescriptionForEditConcept,
  clearPreviousConcept,
  createNewNameForEditConcept,
  removeNameForEditConcept,
} from '../../../redux/actions/concepts/dictionaryConcepts';
import { INTERNAL_MAPPING_DEFAULT_SOURCE, CIEL_SOURCE_URL } from '../components/helperFunction';

export class EditConcept extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        conceptType: PropTypes.string,
        collectionName: PropTypes.string,
        type: PropTypes.string,
        typeName: PropTypes.string,
      }),
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
    createNewName: PropTypes.func.isRequired,
    addNewDescription: PropTypes.func.isRequired,
    clearSelections: PropTypes.func.isRequired,
    fetchExistingConcept: PropTypes.func.isRequired,
    newName: PropTypes.array.isRequired,
    description: PropTypes.array.isRequired,
    clearPreviousConcept: PropTypes.func.isRequired,
    createNewNameForEditConcept: PropTypes.func.isRequired,
    removeDescriptionForEditConcept: PropTypes.func.isRequired,
    addDescriptionForEditConcept: PropTypes.func.isRequired,
    removeNameForEditConcept: PropTypes.func.isRequired,
    existingConcept: PropTypes.object.isRequired,
    updateConcept: PropTypes.func.isRequired,
    answer: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      notEditable: true,
      id: '',
      concept_class: '',
      datatype: 'None',
      names: [],
      descriptions: [],
      isEditConcept: true,
      mappings: [],
    };
    this.conceptUrl = '';

    autoBind(this);
  }

  componentDidMount() {
    this.props.clearPreviousConcept();
    this.props.createNewName();
    this.props.addNewDescription();
    this.updateState();
    const {
      match: {
        params: {
          type, typeName, collectionName, conceptId,
        },
      },
    } = this.props;
    this.conceptUrl = `/${type}/${typeName}/sources/${collectionName}/concepts/${conceptId}/?includeMappings=true`;
    this.props.fetchExistingConcept(this.conceptUrl);
  }

  componentWillUnmount() {
    this.props.clearSelections();
  }

  componentWillReceiveProps(newProps) {
    const { existingConcept } = newProps;
    const { mappings } = this.state;
    if (existingConcept.mappings !== undefined
      && existingConcept.mappings.length > mappings.length) {
      this.organizeMappings(existingConcept.mappings);
    }
  }

  updateState() {
    const {
      match: {
        params: { conceptType, conceptId },
      },
    } = this.props;
    const concept = conceptType || '';
    this.setState({
      ...this.state,
      id: conceptId,
      concept_class: concept,
    });
  }

  handleNewName(event) {
    this.props.createNewNameForEditConcept();
    event.preventDefault();
  }

  removeNewName(event, uuid) {
    event.preventDefault();
    this.props.removeNameForEditConcept(uuid);
  }

  addNewDescription(event) {
    event.preventDefault();
    this.props.addDescriptionForEditConcept();
  }

  removeDescription(event, descriptionRow) {
    event.preventDefault();
    this.props.removeDescriptionForEditConcept(descriptionRow.uuid);
  }

  handleUUID(event) {
    event.preventDefault();
    this.setState(prevState => ({
      notEditable: !prevState.notEditable,
    }));
  }

  handleChange(event) {
    const {
      target: { value, name },
    } = event;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const regx = /^[a-zA-Z\d-_]+$/;
    if (regx.test(this.state.id) && this.state.datatype && this.state.concept_class) {
      this.props.updateConcept(this.conceptUrl, this.state, this.props.history);
    } else {
      if (!regx.test(this.state.id)) {
        notify.show('enter a valid uuid', 'error', 3000);
      }
      if (!this.state.datatype) {
        notify.show('choose a datatype', 'error', 3000);
      }
      notify.show('An error occurred, check your inputs and try again', 'error', 3000);
    }
  }

  addDataFromRow(data) {
    const currentData = this.state.names.filter(name => name.uuid === data.uuid);
    if (currentData.length) {
      const newNames = this.state.names.map(name => (name.uuid === data.uuid ? data : name));
      this.setState(() => ({
        names: newNames,
      }));
    } else {
      this.setState(prevState => ({
        names: [...prevState.names, data],
      }));
    }
  }

  removeDataFromRow(id, arrayName) {
    const newItems = this.state[arrayName].filter(name => name.uuid !== id.uuid);
    this.setState(() => ({
      [arrayName]: newItems,
    }));
  }

  addDataFromDescription(data) {
    const { descriptions } = this.state;
    const currentData = descriptions.filter(description => description.uuid === data.uuid);
    if (currentData.length) {
      const newList = descriptions.map(description => (
        description.uuid === data.uuid ? data : description
      ));
      this.setState(() => ({
        descriptions: newList,
      }));
    } else {
      this.setState(prevState => ({
        descriptions: [...prevState.descriptions, data],
      }));
    }
  }

  addMappingRow = () => {
    const { mappings } = this.state;
    mappings.push({
      map_type: 'Same as',
      source: null,
      to_concept_code: null,
      to_concept_name: null,
      id: mappings.length + 1,
      to_source_url: null,
      isNew: true,
    });
    this.setState({ mappings });
  }

  updateEventListener = (event) => {
    const { tabIndex, name, value } = event.target;
    const { mappings } = this.state;
    mappings[tabIndex][name] = value;
    if (name !== INTERNAL_MAPPING_DEFAULT_SOURCE && mappings[tabIndex].to_concept_code === null) {
      mappings[tabIndex].to_concept_code = String(uid());
    }
    this.setState(mappings);
  }

  updateAsyncSelectValue = (value) => {
    const { mappings } = this.state;
    if (value !== null && value.index !== undefined) {
      mappings[value.index].to_source_url = value.value;
      mappings[value.index].to_concept_name = value.label;
    }
    this.setState({ mappings });
  }

  removeMappingRow = (event) => {
    const { tabIndex } = event.target;
    const { mappings } = this.state;
    delete mappings[tabIndex];
    this.setState({ mappings });
  }

  organizeMappings = (mappings) => {
    const filteredMappings = mappings.map((mapping, i) => {
      if (mapping.to_source_url === CIEL_SOURCE_URL) {
        return {
          id: i,
          map_type: mapping.map_type,
          source: INTERNAL_MAPPING_DEFAULT_SOURCE,
          to_concept_code: mapping.to_concept_code,
          to_concept_name: mapping.to_concept_name,
          to_source_url: mapping.to_concept_url,
          url: mapping.url,
        };
      }
      return {
        id: i,
        map_type: mapping.map_type,
        source: mapping.to_source_url,
        to_concept_code: mapping.to_concept_code,
        to_concept_name: mapping.to_concept_name,
        to_source_url: mapping.to_concept_url,
        url: mapping.url,
      };
    });
    this.setState({
      mappings: filteredMappings,
      from_concept_url: mappings[0].from_concept_url,
      source: mappings[0].source,
    });
  }

  render() {
    const {
      match: {
        params: {
          conceptType, dictionaryName,
        },
      },
      existingConcept,
      loading,
    } = this.props;
    const concept = conceptType ? ` ${conceptType}` : '';
    const path = localStorage.getItem('dictionaryPathName');
    const { mappings } = this.state;
    return (
      <div className="container create-custom-concept">
        <div className="row create-concept-header">
          <div className="col-lg-12">
            <h3>
              {dictionaryName}
: Edit a
              <span className="text-capitalize">{concept}</span>
              {' '}
Concept
              {' '}
              <br />
            </h3>
          </div>
        </div>
        <div className="concept-form-wrapper">
          <div className="row form-container">
            <div className="col-lg-12 col-md-10 col-sm-12">
              { existingConcept
              && (
              <CreateConceptForm
                handleNewName={this.handleNewName}
                nameRows={this.props.newName}
                removeRow={this.removeNewName}
                description={this.props.description}
                editable={this.state.notEditable}
                addDescription={this.addNewDescription}
                removeDescription={this.removeDescription}
                toggleUUID={this.handleUUID}
                concept={concept}
                path={path}
                state={this.state}
                handleChange={this.handleChange}
                handleSelections={this.handleNameLocale}
                handleDescription={this.handleDescriptionLocale}
                handleSubmit={this.handleSubmit}
                addDataFromRow={this.addDataFromRow}
                addDataFromDescription={this.addDataFromDescription}
                removeDataFromRow={this.removeDataFromRow}
                pathName={this.props.match.params}
                existingConcept={existingConcept}
                isEditConcept={this.state.isEditConcept}
                answer={this.props.answer}
                disableButton={loading}
                mappings={mappings}
                addMappingRow={this.addMappingRow}
                updateEventListener={this.updateEventListener}
                removeMappingRow={this.removeMappingRow}
                updateAsyncSelectValue={this.updateAsyncSelectValue}
              />
              )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  newName: state.concepts.newName,
  description: state.concepts.description,
  newConcept: state.concepts.newConcept,
  addedConcept: state.concepts.addConceptToDictionary,
  existingConcept: state.concepts.existingConcept,
  loading: state.concepts.loading,
});
export default connect(
  mapStateToProps,
  {
    createNewName,
    removeNewName,
    addNewDescription,
    removeDescription,
    clearSelections,
    fetchExistingConcept,
    updateConcept,
    addDescriptionForEditConcept,
    removeDescriptionForEditConcept,
    clearPreviousConcept,
    createNewNameForEditConcept,
    removeNameForEditConcept,
  },
)(EditConcept);
