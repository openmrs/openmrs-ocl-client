import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select';
import autoBind from 'react-autobind';
import PropTypes from 'prop-types';
import locale from '../../dashboard/components/dictionary/common/Languages';

class DescriptionRow extends Component {
  static propTypes = {
    newRow: PropTypes.string.isRequired,
    addDataFromDescription: PropTypes.func.isRequired,
    removeDescription: PropTypes.func.isRequired,
    removeDataFromRow: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.newRow,
      locale: 'en',
      description: '',
    };
    autoBind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
      this.sendToTopComponent();
    }
  }

  handleChange(event) {
    const {
      target: { value, name },
    } = event;

    this.setState(() => ({ [name]: value }));
    this.sendToTopComponent();
  }

  handleNameLocale(selectedOptions) {
    this.setState({
      locale: selectedOptions.value,
    });
    this.sendToTopComponent();
  }

  sendToTopComponent() {
    this.props.addDataFromDescription(this.state);
  }

  handleRemove(event, id) {
    this.props.removeDescription(event, id);
    this.props.removeDataFromRow(id, 'descriptions');
  }

  render() {
    return (
      <tr>
        <th scope="row" className="concept-language">
          <Select
            name="locale"
            id="description-locale"
            value={this.state.locale.value}
            onChange={this.handleNameLocale}
            options={locale}
            required
          />
        </th>
        <td>
          <textarea
            type="text"
            rows="3"
            className="form-control"
            onChange={this.handleChange}
            name="description"
            value={this.state.description}
            id="concept-description"
          />
        </td>
        <td>
          <a
            href="#!"
            className="concept-form-table-link"
            id="remove-description"
            onClick={event => this.handleRemove(event, this.props.newRow)}
          >
            remove
          </a>
        </td>
      </tr>
    );
  }
}

export default DescriptionRow;
