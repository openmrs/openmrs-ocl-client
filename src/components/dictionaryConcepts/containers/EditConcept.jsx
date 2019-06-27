import React, { Component } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import { notify } from 'react-notify-toast';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';
import { find } from 'lodash';
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
  unPopulateThisAnswer,
  addSelectedSetsToState,
  removeSelectedSet,
  addNewSetRow,
  unpopulateSet,
} from '../../../redux/actions/concepts/dictionaryConcepts';
import {
  CIEL_SOURCE_URL, MAP_TYPE,
  CANCEL_WARNING, LEAVE_PAGE, STAY_ON_PAGE, LEAVE_PAGE_POPUP_TITLE,
  MAP_TYPES_DEFAULTS,
} from '../components/helperFunction';
import { fetchConceptSources } from '../../../redux/actions/bulkConcepts';
import {
  removeConceptMapping,
  removeEditedConceptMapping, addReferenceToCollectionAction, deleteReferenceFromCollectionAction,
} from '../../../redux/actions/dictionaries/dictionaryActionCreators';
import GeneralModel from '../../dashboard/components/dictionary/common/GeneralModal';
import { recursivelyFetchConceptMappings } from '../../../redux/actions/concepts/addBulkConcepts';
import api from '../../../redux/api';

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
    addSelectedSets: PropTypes.func.isRequired,
    selectedAnswers: PropTypes.array.isRequired,
    selectedSets: PropTypes.array.isRequired,
    removeAnswer: PropTypes.func.isRequired,
    removeSet: PropTypes.func.isRequired,
    createNewAnswerRow: PropTypes.func.isRequired,
    createNewSetRow: PropTypes.func.isRequired,
    unPopulateAnswer: PropTypes.func.isRequired,
    dictionaryConcepts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    addReferenceToCollection: PropTypes.func.isRequired,
    deleteReferenceFromCollection: PropTypes.func.isRequired,
    unpopulateCurrentSet: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      notEditable: true,
      id: '',
      external_id: '',
      concept_class: '',
      datatype: '',
      answers: [],
      sets: [],
      names: [],
      descriptions: [],
      isEditConcept: true,
      mappings: [],
      openGeneralModal: false,
      openDeleteSetModal: false,
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
    this.updateState();
    const {
      match: {
        params: {
          type, typeName, collectionName, conceptId,
        },
      },
      fetchAllConceptSources,
      existingConcept,
    } = this.props;
    this.conceptUrl = `/${type}/${typeName}/sources/${collectionName}/concepts/${conceptId}/?includeMappings=true&verbose=true`;
    this.createUrl = `/${type}/${typeName}/sources/${collectionName}/concepts/`;
    this.props.fetchExistingConcept(this.conceptUrl).then(() => {
      this.oldState = this.state;
    });
    fetchAllConceptSources();
    this.setState({ external_id: existingConcept.external_id });
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.existingConcept !== this.props.existingConcept) {
      const { existingConcept: { datatype } } = this.props;
      this.setState({ datatype });
    }
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
      existingConcept: { datatype },
    } = this.props;
    const concept = conceptType || '';
    this.setState({
      id: conceptId,
      concept_class: concept,
      datatype,
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

  updateConceptReference = async (concept) => {
    const {
      dictionaryConcepts,
      match: { params: { type, typeName, collectionName } },
      deleteReferenceFromCollection,
      addReferenceToCollection,
    } = this.props;
    const conceptRef = dictionaryConcepts.find(c => c.id === concept.id);

    let response = await deleteReferenceFromCollection(type, typeName, collectionName, [
      conceptRef.version_url,
    ]);
    if (!response) return false;

    const toConceptReferences = await recursivelyFetchConceptMappings(
      [conceptRef.id],
      0,
      fromConceptCodes => api.mappings.list.fromAConceptInASource(
        conceptRef.source_url, fromConceptCodes,
      ),
    );

    response = await addReferenceToCollection(type, typeName, collectionName, [conceptRef.url]);
    if (toConceptReferences.length) {
      response = await addReferenceToCollection(
        type, typeName, collectionName, toConceptReferences, false,
      );
    }
    if (!response) return false;

    return true;
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { mappings } = this.state;
    const {
      removeEditedConceptMappingAction,
      history,
      match: { params: { collectionName, type: ownerType, typeName: owner } },
      existingConcept: concept,
    } = this.props;

    const collectionUrl = `${ownerType}/${owner}/collections/${collectionName}/`;

    const retired = mappings.filter(mapping => mapping.retired);
    const freshMappings = mappings.filter(mapping => mapping.isNew);
    const editedAns = this.editedAnswers;
    editedAns.forEach((answer) => {
      const data = {
        references: [answer],
      };
      removeEditedConceptMappingAction(data);
    });

    this.unRetireExistingMappings(freshMappings, retired);

    const regx = /^[a-zA-Z\d-_]+$/;
    if (regx.test(this.state.id) && this.state.datatype && this.state.concept_class) {
      const unRetiredMappings = mappings.filter(m => m.retired === false);
      this.props.updateConcept(
        this.conceptUrl,
        this.state,
        history,
        collectionName,
        concept,
        collectionUrl,
        ownerType,
        owner,
      ).then(result => result && this.updateConceptReference(result, unRetiredMappings)
        .then(() => history.goBack()));
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

  updateSourceEventListener = (event, url, source) => {
    const { value, name } = event.target;
    const defaultRelationship = MAP_TYPES_DEFAULTS[1];
    const relationship = MAP_TYPES_DEFAULTS[0];
    const { mappings } = this.state;
    const newMappings = mappings.map((map) => {
      const modifyMap = map;
      if (modifyMap.url === url) {
        modifyMap[name] = value;
        modifyMap.sourceObject = source;
        if (source && source.url !== CIEL_SOURCE_URL) {
          modifyMap.map_type = defaultRelationship;
        } else {
          modifyMap.map_type = relationship;
        }
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

  hideGeneralModal = () => this.setState({ openGeneralModal: false });

  hideDeleteSetModal = () => this.setState({ openDeleteSetModal: false });

  showGeneralModal = (url) => {
    this.setState({
      openGeneralModal: true,
      url,
    });
  }

  showDeleteSetModal = (url) => {
    this.setState({
      openDeleteSetModal: true,
      url,
    });
  }

  removeUnsavedMappingRow = (url, wasRetired = true) => {
    const { mappings } = this.state;
    let selectedMappings;
    if (wasRetired) {
      selectedMappings = mappings.map((map) => {
        const updatedMap = map;
        if (updatedMap.url === url) {
          updatedMap.retired = true;
        }
        return updatedMap;
      });
    } else {
      selectedMappings = mappings.filter(mapping => mapping.url !== url);
    }

    this.setState({ mappings: selectedMappings });
  }

  confirmRemoveMappingRow = async (uniqueKey) => {
    const { url } = this.state;
    const {
      removeConceptMappingAction,
      removeAnswer,
      match: { params: { type: ownerType, typeName: owner, collectionName } },
    } = this.props;
    const data = {
      references: [url],
    };
    await removeConceptMappingAction(data, ownerType, owner, collectionName);
    this.removeUnsavedMappingRow(url);
    removeAnswer(uniqueKey);
    this.hideGeneralModal();
  }

  confirmRemoveSetRow = async (uniqueKey) => {
    const { url } = this.state;
    const {
      removeConceptMappingAction,
      removeSet,
      match: { params: { type: ownerType, typeName: owner, collectionName } },
    } = this.props;
    const data = {
      references: [url],
    };
    await removeConceptMappingAction(data, ownerType, owner, collectionName);
    this.removeUnsavedMappingRow(url);
    removeSet(uniqueKey);
    this.hideDeleteSetModal();
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
      this.removeUnsavedMappingRow(url, false);
      return;
    }
    this.showGeneralModal(url);
  }

  organizeMappings = (mappings) => {
    const { allSources } = this.props;
    const filteredMappings = mappings.map((mapping, i) => ({
      id: i,
      map_type: mapping.map_type,
      source: mapping.to_source_url,
      sourceObject: find(allSources, { url: mapping.to_source_url }),
      to_concept_code: mapping.to_concept_code,
      to_concept_name: mapping.to_concept_name,
      to_source_url: mapping.to_concept_url,
      url: mapping.url,
      retired: mapping.retired,
    }));
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

  handleSetAsyncSelectChange = (sets, uniqueKey) => {
    const { addSelectedSets, selectedSets } = this.props;
    addSelectedSets(sets, uniqueKey);

    const setsToAdd = selectedSets
      .filter(set => set.map_type === MAP_TYPE.conceptSet)
      .filter(set => set.prePopulated !== true);
    this.setState({
      sets: setsToAdd,
    });
  };

  addAnswerRow = () => {
    const { createNewAnswerRow } = this.props;
    const frontEndUniqueKey = uuid();
    const initialAnswerFormation = {
      frontEndUniqueKey,
    };
    createNewAnswerRow(initialAnswerFormation);
  }

  addSetRow = () => {
    const { createNewSetRow } = this.props;
    const frontEndUniqueKey = uuid();
    const initialSetFormation = {
      frontEndUniqueKey,
    };
    createNewSetRow(initialSetFormation);
  };

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
    const { answer, answer: { map_type }, answerUrl } = info;
    const { unPopulateAnswer, unpopulateCurrentSet } = this.props;
    const { conceptSet, questionAndAnswer } = MAP_TYPE;
    this.editedAnswers = [...this.editedAnswers, answerUrl];
    this.removeUnsavedMappingRow(answerUrl);
    if (map_type === questionAndAnswer) {
      unPopulateAnswer(answer);
    } else if (map_type === conceptSet) {
      unpopulateCurrentSet(answer);
    }
  };

  removeSetRow = (uniqueKey, editing, url, name, prePopulated) => {
    const { removeSet } = this.props;
    this.setState({
      deletingSet: true,
      setToDeleteName: name,
      uniqueKey,
    });
    if (editing && prePopulated) {
      this.showDeleteSetModal(url);
      this.removeUnsavedMappingRow(url);
      return true;
    }
    removeSet(uniqueKey);
    return true;
  };

  unRetireExistingMappings = async (freshMappings, retired) => {
    const toBeUnRetired = [];
    freshMappings.forEach((mapping) => {
      const mappingToUnBeRetired = retired.find(m => m.to_concept_code === mapping.to_concept_code);
      if (mappingToUnBeRetired) toBeUnRetired.push(mappingToUnBeRetired.url);
    });
    for (let i = 0; i < toBeUnRetired.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await this.props.unretireMapping(toBeUnRetired[i]);
    }
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
      selectedSets,
    } = this.props;
    const concept = conceptType ? ` ${conceptType}` : '';
    const path = localStorage.getItem('dictionaryPathName');
    const {
      mappings,
      mapp,
      openGeneralModal,
      openDeleteSetModal,
      deletingAnswer,
      deletingSet,
      answerToDeleteName,
      setToDeleteName,
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
                allSources={this.props.allSources}
                handleAsyncSelectChange={this.handleAsyncSelectChange}
                selectedAnswers={selectedAnswers}
                addAnswerRow={this.addAnswerRow}
                removeAnswerRow={this.removeAnswerRow}
                currentDictionaryName={dictionaryName}
                showModal={this.showModal}
                removeCurrentAnswer={this.removeCurrentAnswer}
                handleSetAsyncSelectChange={this.handleSetAsyncSelectChange}
                selectedSets={selectedSets}
                removeSetRow={this.removeSetRow}
                addSetRow={this.addSetRow}
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
                title={`Confirm deleting the ${deletingSet ? 'set' : 'mapping'} for Concept ${existingConcept.display_name}`}
                content={
                  deletingSet
                    ? `Are you sure you want to delete the set '${setToDeleteName}'?`
                    : `Are you sure you want to delete the mapping for ${existingConcept.display_name} to ${mapp}?`}
                show={openDeleteSetModal}
                confirm_button="Confirm"
                cancel_button="Cancel"
                hide={this.hideDeleteSetModal}
                select_confirm={() => this.confirmRemoveSetRow(uniqueKey)}
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
  selectedSets: state.concepts.selectedSets,
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
    addSelectedSets: addSelectedSetsToState,
    removeAnswer: removeSelectedAnswer,
    removeSet: removeSelectedSet,
    createNewAnswerRow: addNewAnswerRow,
    createNewSetRow: addNewSetRow,
    unPopulateAnswer: unPopulateThisAnswer,
    unpopulateCurrentSet: unpopulateSet,
    addReferenceToCollection: addReferenceToCollectionAction,
    deleteReferenceFromCollection: deleteReferenceFromCollectionAction,
  },
)(EditConcept);
