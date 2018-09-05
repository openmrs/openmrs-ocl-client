import React, { Component } from 'react';
import autoBind from 'react-autobind';
import PropTypes from 'prop-types';

class AnswersRow extends Component {
  static propTypes = {
    newRow: PropTypes.object.isRequired,
    addDataFromAnswer: PropTypes.func.isRequired,
    removeAnswer: PropTypes.func.isRequired,
    removeDataFromRow: PropTypes.func.isRequired,
    existingConcept: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.newRow.uuid,
      answer: [],
    };
    autoBind(this);
  }

  componentDidMount() {
    if (this.props.existingConcept) {
      this.updateState();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
      this.sendToTopComponent();
    }
  }

  updateState() {
    const { newRow } = this.props;
    this.setState({
      ...this.state,
      id: newRow.uuid,
      answer: newRow.answer || '',
    });
  }

  handleChange(event) {
    const {
      target: { value, name },
    } = event;
    this.setState(() => ({ [name]: value }));
    this.sendToTopComponent();
  }

  sendToTopComponent() {
    this.props.addDataFromAnswer(this.state);
  }

  handleRemove(event, id) {
    event.preventDefault();
    const { removeAnswer, removeDataFromRow } = this.props;
    removeAnswer(id);
    removeDataFromRow(id, 'answers');
  }

  render() {
    return (
      <tr>
        <td>
          <input
            type="text"
            className="form-control answer"
            placeholder="eg. /orgs/Regenstrief/sources/loinc2/concepts/32700-7/"
            name="answer"
            value={this.state.answer}
            onChange={this.handleChange}
            id="concept-answer"
            required
          />
        </td>
        <td>
          <a
            href="#!"
            className="concept-form-table-link answer"
            id="remove-answer"
            onClick={event => this.handleRemove(event, this.props.newRow.uuid)}
          >
            remove
          </a>
        </td>
      </tr>
    );
  }
}

export default AnswersRow;
