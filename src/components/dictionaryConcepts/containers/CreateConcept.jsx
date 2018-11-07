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
  addNewAnswer,
  removeAnswer,
} from '../../../redux/actions/concepts/dictionaryConcepts';

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
    addNewAnswer: PropTypes.func.isRequired,
    removeAnswer: PropTypes.func.isRequired,
    answer: PropTypes.array.isRequired,
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
    this.props.addNewAnswer();
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
        notify.show('concept successfully created', 'success', 3000);
        nextProps.history.push(
          `/concepts/${type}/${typeName}/${collectionName}/${dictionaryName}/${language}`,
        );
      }, 3000);
    }
  }

  componentWillUnmount() {
    this.props.clearSelections();
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
    const {
      match: {
        params: { collectionName, type, typeName },
      },
    } = this.props;
    const url = `/${type}/${typeName}/sources/${collectionName}/concepts/`;
    event.preventDefault();
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
    } = this.props;
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
            <div className="col-lg-12 col-md-10 col-sm-12">
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
                addAnswer={this.addNewAnswer}
                answer={this.props.answer}
                addDataFromAnswer={this.addDataFromAnswer}
                removeAnswer={this.removeAnswer}
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
  answer: state.concepts.answer,
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
    addNewAnswer,
    removeAnswer,
  },
)(CreateConcept);
