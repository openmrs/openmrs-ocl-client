import React, { Component } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import { notify } from 'react-notify-toast';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';
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
  unretireMapping,
  addSelectedAnswersToState,
  removeSelectedAnswer,
  addNewAnswerRow,
  createNewConcept,
  unPopulateThisAnswer,
} from '../../../redux/actions/concepts/dictionaryConcepts';
import {
  INTERNAL_MAPPING_DEFAULT_SOURCE, CIEL_SOURCE_URL, MAP_TYPE, ATTRIBUTE_NAME_SOURCE,
  CANCEL_WARNING, LEAVE_PAGE, STAY_ON_PAGE, LEAVE_PAGE_POPUP_TITLE,
  MAP_TYPES_DEFAULTS,
} from '../components/helperFunction';
import { fetchConceptSources } from '../../../redux/actions/bulkConcepts';
import {
  removeDictionaryConcept,
  removeConceptMapping,
  removeEditedConceptMapping,
} from '../../../redux/actions/dictionaries/dictionaryActionCreators';
import GeneralModel from '../../dashboard/components/dictionary/common/GeneralModal';

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
    loading: PropTypes.bool.isRequired,
    fetchAllConceptSources: PropTypes.func.isRequired,
    allSources: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    removeConceptMappingAction: PropTypes.func.isRequired,
    removeEditedConceptMappingAction: PropTypes.func.isRequired,
    unretireMapping: PropTypes.func.isRequired,
    addSelectedAnswers: PropTypes.func.isRequired,
    selectedAnswers: PropTypes.array.isRequired,
    removeAnswer: PropTypes.func.isRequired,
    createNewAnswerRow: PropTypes.func.isRequired,
    deleteConcept: PropTypes.func.isRequired,
    recreateConcept: PropTypes.func.isRequired,
    unPopulateAnswer: PropTypes.func.isRequired,
    dictionaryConcepts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      notEditable: true,
      id: '',
      concept_class: '',
      datatype: 'None',
      answers: [],
      names: [],
      descriptions: [],
      isEditConcept: true,
      mappings: [],
      openGeneralModal: false,
      url: '',
      mapp: '',
      show: false,
      uniqueKey: '',
    };
    this.conceptUrl = '';
    this.createUrl = '';
    this.oldState = {};
    this.editedAnswers = [];
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
      fetchAllConceptSources,
    } = this.props;
    this.conceptUrl = `/${type}/${typeName}/sources/${collectionName}/concepts/${conceptId}/?includeMappings=true&verbose=true`;
    this.createUrl = `/${type}/${typeName}/sources/${collectionName}/concepts/`;
    this.props.fetchExistingConcept(this.conceptUrl).then(() => {
      this.oldState = this.state;
    });
    fetchAllConceptSources();
  }

  componentWillUnmount() {
    this.props.clearSelections();
  }

  componentWillReceiveProps(newProps) {
    const { existingConcept } = newProps;
    const { mappings } = this.state;
    if (existingConcept && existingConcept.mappings
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

  removeNewName(event, uid) {
    event.preventDefault();
    this.props.removeNameForEditConcept(uid);
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

  recreateMappings = mappings => mappings.map((mapping) => {
    const isInternal = Boolean(
      mapping.to_source_url
      && (mapping.to_source_url.trim().toLowerCase() === CIEL_SOURCE_URL.trim().toLowerCase()),
    );
    const freshMapping = {
      ...mapping,
      isNew: true,
      url: String(uuid()),
      source: isInternal ? INTERNAL_MAPPING_DEFAULT_SOURCE : mapping.source,
      to_source_url: isInternal
        ? `${mapping.to_source_url}concepts/${mapping.to_concept_code}/`
        : mapping.to_source_url,
    };
    return freshMapping;
  });

  deleteConceptReference = (version_url) => {
    const { deleteConcept, match: { params: { type, typeName, collectionName } } } = this.props;
    deleteConcept({ references: [version_url] }, type, typeName, collectionName);
  }

  updateConceptReference = async (concept, mappings) => {
    const { answers } = this.state;
    const { recreateConcept, dictionaryConcepts } = this.props;
    const conceptRef = dictionaryConcepts.find(c => c.id === concept.id);
    const newMappings = mappings && this.recreateMappings(mappings);
    const freshConcept = {
      ...concept,
      id: String(uuid()),
      answers,
      mappings: newMappings,
    };
    recreateConcept(freshConcept, this.createUrl)
      .then(() => this.deleteConceptReference(conceptRef.version_url));
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { mappings } = this.state;
    const { removeEditedConceptMappingAction, history } = this.props;
    const retired = mappings.filter(mapping => mapping.retired);
    const freshMappings = mappings.filter(mapping => mapping.isNew);
    const editedAns = this.editedAnswers;
    editedAns.forEach((answer) => {
      const data = {
        references: [answer],
      };
      removeEditedConceptMappingAction(data);
    });

    freshMappings.forEach((mapping) => {
      const toBeUnRetired = retired.find(m => m.to_concept_name === mapping.to_concept_name);
      if (toBeUnRetired) this.props.unretireMapping(toBeUnRetired.url);
    });

    const regx = /^[a-zA-Z\d-_]+$/;
    if (regx.test(this.state.id) && this.state.datatype && this.state.concept_class) {
      const unRetiredMappings = mappings.filter(m => m.retired === false);
      this.props.updateConcept(this.conceptUrl, this.state, history)
        .then(editedConcept => this.updateConceptReference(editedConcept, unRetiredMappings)
          .then(() => setTimeout(() => history.goBack(), 2000)));
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
      if (name === ATTRIBUTE_NAME_SOURCE) {
        modifyMap.to_concept_code = '';
        modifyMap.to_concept_name = '';
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

  hideGeneralModal = () => this.setState({ openGeneralModal: false });

  showGeneralModal = (url) => {
    this.setState({
      openGeneralModal: true,
      url,
    });
  }

  removeUnsavedMappingRow = (url) => {
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

  confirmRemoveMappingRow = async (uniqueKey) => {
    const { url } = this.state;
    const { removeConceptMappingAction, removeAnswer } = this.props;
    const data = {
      references: [url],
    };
    await removeConceptMappingAction(data);
    this.removeUnsavedMappingRow(url);
    removeAnswer(uniqueKey);
    this.hideGeneralModal();
  }

  selectConfirm = () => {
    const path = localStorage.getItem('dictionaryPathName');
    if (path) {
      this.props.history.push(path);
    } else {
      notify.show('An error occurred with your internet connection, please fix it and try reloading the page.', 'error', 3000);
    }
  }

  hideModal = () => this.setState({ show: false });

  showModal = () => {
    if (this.oldState === this.state) {
      this.selectConfirm();
    } else {
      this.setState(
        { show: true },
      );
    }
  }

  removeMappingRow = (url, name, code) => {
    const { mappings } = this.state;
    const mapp = name || code;
    this.setState({ mapp });
    const filterMappings = mappings.filter(map => map.url === url);
    if (filterMappings[0].isNew) {
      this.removeUnsavedMappingRow(url);
      return;
    }
    this.showGeneralModal(url);
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
          retired: mapping.retired,
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
        retired: mapping.retired,
      };
    });
    this.setState({
      mappings: filteredMappings,
      from_concept_url: mappings[0].from_concept_url,
      source: mappings[0].source,
    });
  }

  handleAsyncSelectChange = (answers, uniqueKey) => {
    const { addSelectedAnswers, selectedAnswers } = this.props;
    addSelectedAnswers(answers, uniqueKey);

    const answersToAdd = selectedAnswers
      .filter(ans => ans.map_type === MAP_TYPE.questionAndAnswer)
      .filter(ans => ans.prePopulated !== true);
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

  removeAnswerRow = (uniqueKey, editing, url, name, prepopulated) => {
    const { removeAnswer } = this.props;
    this.setState({
      deletingAnswer: true,
      answerToDeleteName: name,
      uniqueKey,
    });
    if (editing && prepopulated) {
      this.showGeneralModal(url);
      this.removeUnsavedMappingRow(url);
      return true;
    }
    removeAnswer(uniqueKey);
    return true;
  }

  removeCurrentAnswer = (info) => {
    const { unPopulateAnswer } = this.props;
    this.editedAnswers = [...this.editedAnswers, info.answerUrl];
    this.removeUnsavedMappingRow(info.answerUrl);
    unPopulateAnswer(info.answer);
  };

  render() {
    const {
      match: {
        params: {
          conceptType, dictionaryName,
        },
      },
      existingConcept,
      loading,
      selectedAnswers,
    } = this.props;
    const concept = conceptType ? ` ${conceptType}` : '';
    const path = localStorage.getItem('dictionaryPathName');
    const {
      mappings,
      mapp,
      openGeneralModal,
      deletingAnswer,
      answerToDeleteName,
      uniqueKey,
    } = this.state;
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
                disableButton={loading}
                mappings={mappings}
                addMappingRow={this.addMappingRow}
                updateEventListener={this.updateEventListener}
                updateSourceEventListener={this.updateSourceEventListener}
                removeMappingRow={this.removeMappingRow}
                updateAsyncSelectValue={this.updateAsyncSelectValue}
                allSources={this.props.allSources}
                handleAsyncSelectChange={this.handleAsyncSelectChange}
                selectedAnswers={selectedAnswers}
                addAnswerRow={this.addAnswerRow}
                removeAnswerRow={this.removeAnswerRow}
                currentDictionaryName={dictionaryName}
                showModal={this.showModal}
                removeCurrentAnswer={this.removeCurrentAnswer}
              />
              )
              }
              <GeneralModel
                title={`Confirm deleting the ${deletingAnswer ? 'answer' : 'mapping'} for Concept ${existingConcept.display_name}`}
                content={
                  deletingAnswer
                    ? `Are you sure you want to delete the answer '${answerToDeleteName}'?`
                    : `Are you sure you want to delete the mapping for ${existingConcept.display_name} to ${mapp}?`}
                show={openGeneralModal}
                confirm_button="Confirm"
                cancel_button="Cancel"
                hide={this.hideGeneralModal}
                select_confirm={() => this.confirmRemoveMappingRow(uniqueKey)}
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
  existingConcept: state.concepts.existingConcept,
  loading: state.concepts.loading,
  allSources: state.sourceConcepts.conceptSources,
  selectedAnswers: state.concepts.selectedAnswers,
  dictionaryConcepts: state.concepts.dictionaryConcepts,
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
    unretireMapping,
    fetchAllConceptSources: fetchConceptSources,
    removeConceptMappingAction: removeConceptMapping,
    removeEditedConceptMappingAction: removeEditedConceptMapping,
    addSelectedAnswers: addSelectedAnswersToState,
    removeAnswer: removeSelectedAnswer,
    createNewAnswerRow: addNewAnswerRow,
    deleteConcept: removeDictionaryConcept,
    recreateConcept: createNewConcept,
    unPopulateAnswer: unPopulateThisAnswer,
  },
)(EditConcept);
