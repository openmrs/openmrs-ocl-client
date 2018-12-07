import React, { Component } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import { notify } from 'react-notify-toast';
import PropTypes from 'prop-types';
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
  addNewAnswer,
  removeAnswer,
} from '../../../redux/actions/concepts/dictionaryConcepts';

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
    addNewAnswer: PropTypes.func.isRequired,
    removeAnswer: PropTypes.func.isRequired,
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
      answers: [],
      isEditConcept: true,
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
    this.conceptUrl = `/${type}/${typeName}/sources/${collectionName}/concepts/${conceptId}/`;
    this.props.fetchExistingConcept(this.conceptUrl);
  }

  componentWillUnmount() {
    this.props.clearSelections();
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

  addNewAnswer() {
    this.props.addNewAnswer();
  }
  removeAnswer(id) {
    this.props.removeAnswer(id);
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

  addDataFromAnswer(data) {
    const currentAnswer = this.state.answers.filter(answer => answer.id === data.id);
    if (currentAnswer.length) {
      const newList = this.state.answers.map(answer => (
        answer.id === data.id ? data : answer
      ));
      this.setState(() => ({
        answers: newList,
      }));
    } else {
      this.setState(prevState => ({
        answers: [...prevState.answers, data],
      }));
    }
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
                addDataFromAnswer={this.addDataFromAnswer}
                addAnswer={this.addNewAnswer}
                removeAnswer={this.removeAnswer}
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
  answer: state.concepts.answer,
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
    addNewAnswer,
    removeAnswer,
  },
)(EditConcept);
