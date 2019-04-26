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
  addSelectedAnswersToState,
  removeSelectedAnswer,
  unpopulatePrepopulatedAnswers,
  addNewAnswerRow,
} from '../../../redux/actions/concepts/dictionaryConcepts';
import { fetchConceptSources } from '../../../redux/actions/bulkConcepts';
import {
  MAP_TYPE, CANCEL_WARNING, LEAVE_PAGE, STAY_ON_PAGE, LEAVE_PAGE_POPUP_TITLE,
  INTERNAL_MAPPING_DEFAULT_SOURCE, MAP_TYPES_DEFAULTS,
} from '../components/helperFunction';
import GeneralModel from '../../dashboard/components/dictionary/common/GeneralModal';

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
    addSelectedAnswers: PropTypes.func.isRequired,
    selectedAnswers: PropTypes.array.isRequired,
    fetchAllConceptSources: PropTypes.func.isRequired,
    allSources: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    unpopulateSelectedAnswers: PropTypes.func.isRequired,
    removeAnswer: PropTypes.func.isRequired,
    createNewAnswerRow: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      notEditable: true,
      id: String(uuid()),
      concept_class: '',
      datatype: 'None',
      names: [],
      answers: [],
      descriptions: [],
      mappings: [{
        map_type: 'Same as',
        source: null,
        to_concept_code: null,
        to_concept_name: null,
        id: 1,
        to_source_url: null,
        isNew: true,
        retired: false,
        url: uuid(),
      }],
      show: false,
    };
    this.oldState = {};
    autoBind(this);
  }

  componentDidMount() {
    const {
      match: {
        params: { conceptType },
      },
      fetchAllConceptSources,
      unpopulateSelectedAnswers,
    } = this.props;
    unpopulateSelectedAnswers();
    const concept = conceptType || '';
    this.initializeConcept(concept).then(() => {
      this.oldState = this.state;
    });
    fetchAllConceptSources();
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

  initializeConcept = async (concept) => {
    const { newName, description } = this.props;
    if (newName.length === 0) {
      this.props.createNewName();
    }
    if (description.length === 0) {
      this.props.addNewDescription();
    }
    this.setState({ concept_class: concept });
  }

  handleAsyncSelectChange = (answers, uniqueKey) => {
    const { addSelectedAnswers, selectedAnswers } = this.props;
    addSelectedAnswers(answers, uniqueKey);
    const answersToAdd = selectedAnswers.filter(ans => ans.map_type === MAP_TYPE.questionAndAnswer);
    this.setState({
      answers: answersToAdd,
    });
  }

  addAnswerRow = () => {
    const { createNewAnswerRow } = this.props;
    const frontEndUniqueKey = uuid();
    const initialAnswerFormation = {
      frontEndUniqueKey,
    };
    createNewAnswerRow(initialAnswerFormation);
  }

  removeAnswerRow = (uniqueKey) => {
    const { removeAnswer } = this.props;
    removeAnswer(uniqueKey);
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

  removeDataFromRow(data, arrayName) {
    const id = data.uuid;
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
      isNew: true,
      retired: false,
      url: uuid(),
    });
    this.setState({ mappings });
  }

  updateSourceEventListener = (event, url) => {
    const { value, name } = event.target;
    const defaultRelationship = MAP_TYPES_DEFAULTS[1];
    const relationship = MAP_TYPES_DEFAULTS[0];
    const { mappings } = this.state;
    const newMappings = mappings.map((map) => {
      const modifyMap = map;
      if (modifyMap.url === url) {
        modifyMap[name] = value;
      }
      if (modifyMap.source !== INTERNAL_MAPPING_DEFAULT_SOURCE) {
        modifyMap.map_type = defaultRelationship;
      } else {
        modifyMap.map_type = relationship;
      }
      return modifyMap;
    });
    this.setState({ mappings: newMappings });
  }

  updateEventListener = (event, url) => {
    const { value, name } = event.target;
    const { mappings } = this.state;
    const newMappings = mappings.map((map) => {
      const modifyMap = map;
      if (modifyMap.url === url) {
        modifyMap[name] = value;
      }
      return modifyMap;
    });
    this.setState({ mappings: newMappings });
  }

  updateAsyncSelectValue = (value) => {
    const { mappings } = this.state;
    const updateAsyncMappings = mappings.map((map) => {
      const updatedMap = map;
      if (value !== null && value.index !== undefined && updatedMap.url === value.index) {
        updatedMap.to_source_url = value.value;
        updatedMap.to_concept_name = value.label;
      }
      return updatedMap;
    });
    this.setState({ mappings: updateAsyncMappings });
  }

  removeMappingRow = (url) => {
    const { mappings } = this.state;
    const selectedMappings = mappings.map((map) => {
      const updatedMap = map;
      if (updatedMap.url === url) {
        updatedMap.retired = true;
      }
      return updatedMap;
    });
    this.setState({ mappings: selectedMappings });
  }

  selectConfirm = () => {
    this.props.history.push(localStorage.getItem('dictionaryPathName'));
  }

  hideModal = () => this.setState({ show: false });

  showModal = () => {
    if (this.oldState === this.state) {
      this.selectConfirm();
    } else {
      this.setState({ show: true });
    }
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
    const concept = conceptType ? `${conceptType}` : '';
    const path = localStorage.getItem('dictionaryPathName');
    const append = concept === 'set' ? ' of concepts' : ' concept';

    return (
      <div className="container create-custom-concept">
        <div className="row create-concept-header">
          <div className="col-lg-12">
            <h3>
              {dictionaryName}
: Create a
              {' '}
              <span className="text-capitalize">{concept}</span>
              {append}
              <br />
            </h3>
          </div>
        </div>
        <div className="concept-form-wrapper">
          <div className="row form-container">
            <div className="col-lg-12 custom-side-padding">
              <CreateConceptForm
                currentDictionaryName={dictionaryName}
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
                selectedAnswers={selectedAnswers}
                addAnswerRow={this.addAnswerRow}
                removeAnswerRow={this.removeAnswerRow}
                mappings={mappings}
                addMappingRow={this.addMappingRow}
                updateEventListener={this.updateEventListener}
                updateSourceEventListener={this.updateSourceEventListener}
                removeMappingRow={this.removeMappingRow}
                updateAsyncSelectValue={this.updateAsyncSelectValue}
                allSources={this.props.allSources}
                showModal={this.showModal}
              />
              <GeneralModel
                title={LEAVE_PAGE_POPUP_TITLE}
                content={CANCEL_WARNING}
                show={this.state.show}
                confirm_button={LEAVE_PAGE}
                cancel_button={STAY_ON_PAGE}
                hide={this.hideModal}
                select_confirm={this.selectConfirm}
                showModal={this.showModal}
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
  selectedAnswers: state.concepts.selectedAnswers,
  allSources: state.sourceConcepts.conceptSources,
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
    addSelectedAnswers: addSelectedAnswersToState,
    removeAnswer: removeSelectedAnswer,
    fetchAllConceptSources: fetchConceptSources,
    unpopulateSelectedAnswers: unpopulatePrepopulatedAnswers,
    createNewAnswerRow: addNewAnswerRow,
  },
)(CreateConcept);
