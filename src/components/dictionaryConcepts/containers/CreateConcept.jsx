import React, { Component } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import uuid from 'uuid/v4';
import { notify } from 'react-notify-toast';
import PropTypes from 'prop-types';
import CreateConceptForm from '../components/CreateConceptForm';
import {
  createNewName,
  removeNewName,
  addNewDescription,
  removeDescription,
  clearSelections,
  createNewConcept,
  queryPossibleAnswers,
  addSelectedAnswersToState,
  changeSelectedAnswer,
} from '../../../redux/actions/concepts/dictionaryConcepts';
import { INTERNAL_MAPPING_DEFAULT_SOURCE } from '../components/helperFunction';

export class CreateConcept extends Component {
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
    removeNewName: PropTypes.func.isRequired,
    removeDescription: PropTypes.func.isRequired,
    createNewConcept: PropTypes.func.isRequired,
    newName: PropTypes.array.isRequired,
    description: PropTypes.array.isRequired,
    newConcept: PropTypes.shape({
      id: PropTypes.string,
      concept_class: PropTypes.string,
      datatype: PropTypes.string,
      names: PropTypes.array,
      descriptions: PropTypes.array,
    }).isRequired,
    addedConcept: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    getPossibleAnswers: PropTypes.func.isRequired,
    queryResults: PropTypes.array.isRequired,
    addSelectedAnswers: PropTypes.func.isRequired,
    selectedAnswers: PropTypes.array.isRequired,
    changeAnswer: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      notEditable: true,
      id: String(uuid()),
      concept_class: '',
      datatype: 'None',
      names: [],
      descriptions: [],
      answers: [],
      mappings: [{
        map_type: 'Same as',
        source: null,
        to_concept_code: null,
        to_concept_name: null,
        id: 1,
        to_source_url: null,
      }],
    };

    autoBind(this);
  }

  componentDidMount() {
    const {
      match: {
        params: { conceptType },
      },
    } = this.props;
    const concept = conceptType || '';
    this.props.createNewName();
    this.props.addNewDescription();
    // eslint-disable-next-line
    this.setState({ concept_class: concept });
  }

  componentWillReceiveProps(nextProps) {
    const {
      match: {
        params: {
          collectionName, type, typeName, dictionaryName, language,
        },
      },
    } = this.props;
    const { newConcept, addedConcept } = nextProps;
    const isNewConcept = Object.keys(newConcept).length;
    const isAddedConcept = addedConcept.length;
    if (isNewConcept && isAddedConcept) {
      setTimeout(() => {
        nextProps.history.push(`/concepts/${type}/${typeName}/${collectionName}/${dictionaryName}/${language}`);
        notify.show('concept successfully created', 'success', 3000);
      }, 10);
    }
  }

  componentWillUnmount() {
    this.props.clearSelections();
  }

  handleAsyncSelectChange = (answers) => {
    const { addSelectedAnswers } = this.props;
    addSelectedAnswers(answers);
    this.setState({ answers });
  }

  queryAnswers = (query) => {
    const { queryResults, getPossibleAnswers } = this.props;
    const defaults = { map_type: 'Same as', map_scope: 'Internal' };
    getPossibleAnswers(query);
    const options = queryResults.map(concept => ({
      ...concept,
      ...defaults,
      value: `${concept.url}`,
      label: `${concept.owner}: ${concept.display_name}`,
    }));
    return options;
  }

  handleAnswerChange = (event, id) => {
    const { changeAnswer, selectedAnswers } = this.props;
    const obj = { id, [event.target.name]: event.target.value };
    changeAnswer(obj);
    this.setState({ answers: selectedAnswers });
  }

  handleNewName(event) {
    this.props.createNewName();
    event.preventDefault();
  }

  removeNewName(event, id) {
    event.preventDefault();
    this.props.removeNewName(id);
  }

  addNewDescription(event) {
    event.preventDefault();
    this.props.addNewDescription();
  }

  removeDescription(event, id) {
    event.preventDefault();
    this.props.removeDescription(id);
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
    const {
      match: {
        params: { collectionName, type, typeName },
      },
    } = this.props;
    const url = `/${type}/${typeName}/sources/${collectionName}/concepts/`;
    const regx = /^[a-zA-Z\d-_]+$/;
    if (regx.test(this.state.id) && this.state.datatype && this.state.concept_class) {
      this.props.createNewConcept(this.state, url);
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
    const currentData = this.state.names.filter(name => name.id === data.id);
    if (currentData.length) {
      const newNames = this.state.names.map(name => (name.id === data.id ? data : name));
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
    const currentData = this.state[arrayName].filter(name => name.id !== id);
    if (currentData.length) {
      const newItems = this.state[arrayName].filter(name => name.id !== id);
      this.setState(() => ({
        [arrayName]: newItems,
      }));
    }
  }

  addDataFromDescription(data) {
    const currentData = this.state.descriptions.filter(description => description.id === data.id);
    if (currentData.length) {
      const newList = this.state.descriptions.map(description => (
        description.id === data.id ? data : description
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
    });
    this.setState({ mappings });
  }

  updateEventListener = (event) => {
    const { tabIndex, name, value } = event.target;
    const { mappings } = this.state;
    mappings[tabIndex][name] = value;
    if (name !== INTERNAL_MAPPING_DEFAULT_SOURCE && mappings[tabIndex].to_concept_code === null) {
      mappings[tabIndex].to_concept_code = String(uuid());
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

  render() {
    const {
      match: {
        params: {
          conceptType, dictionaryName,
        },
      },
      loading,
      selectedAnswers,
    } = this.props;
    const { mappings } = this.state;
    const concept = conceptType ? ` ${conceptType}` : '';
    const path = localStorage.getItem('dictionaryPathName');
    return (
      <div className="container create-custom-concept">
        <div className="row create-concept-header">
          <div className="col-lg-12">
            <h3>
              {dictionaryName}
: Create a
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
            <div className="col-lg-12 custom-side-padding">
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
                disableButton={loading}
                handleSelections={this.handleNameLocale}
                handleDescription={this.handleDescriptionLocale}
                handleSubmit={this.handleSubmit}
                addDataFromRow={this.addDataFromRow}
                addDataFromDescription={this.addDataFromDescription}
                removeDataFromRow={this.removeDataFromRow}
                pathName={this.props.match.params}
                handleAsyncSelectChange={this.handleAsyncSelectChange}
                queryAnswers={this.queryAnswers}
                selectedAnswers={selectedAnswers}
                handleAnswerChange={this.handleAnswerChange}
                mappings={mappings}
                addMappingRow={this.addMappingRow}
                updateEventListener={this.updateEventListener}
                removeMappingRow={this.removeMappingRow}
                updateAsyncSelectValue={this.updateAsyncSelectValue}
              />
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
  loading: state.concepts.loading,
  queryResults: state.concepts.queryResults,
  selectedAnswers: state.concepts.selectedAnswers,

});
export default connect(
  mapStateToProps,
  {
    createNewName,
    removeNewName,
    addNewDescription,
    removeDescription,
    clearSelections,
    createNewConcept,
    getPossibleAnswers: queryPossibleAnswers,
    addSelectedAnswers: addSelectedAnswersToState,
    changeAnswer: changeSelectedAnswer,
  },
)(CreateConcept);
