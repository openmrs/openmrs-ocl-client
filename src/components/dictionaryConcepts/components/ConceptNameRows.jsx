import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Select from 'react-select';
import 'react-select/dist/react-select';
import PropTypes from 'prop-types';
import locale from '../../dashboard/components/dictionary/common/Languages';

class ConceptNameRows extends Component {
  static propTypes = {
    newRow: PropTypes.func.isRequired,
    addDataFromRow: PropTypes.func.isRequired,
    removeRow: PropTypes.func.isRequired,
    removeDataFromRow: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.newRow,
      name: '',
      locale: 'en',
      locale_preferred: 'Yes',
      name_type: 'Fully Specified',
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
    this.props.addDataFromRow(this.state);
  }

  handleRemove(event, id) {
    this.props.removeRow(event, id);
    this.props.removeDataFromRow(id, 'names');
  }

  render() {
    return (
      <tr>
        <th scope="row" className="concept-language">
          <Select
            name="locale"
            value={this.state.locale.value}
            onChange={this.handleNameLocale}
            options={locale}
            required
          />
        </th>
        <td>
          <select
            id="type"
            name="name_type"
            value={this.state.name_type}
            className="form-control"
            onChange={this.handleChange}
            required
          >
            <option />
            <option>Fully Specified</option>
          </select>
        </td>
        <td>
          <input
            type="text"
            className="form-control"
            onChange={this.handleChange}
            placeholder="eg. Malaria"
            name="name"
            value={this.state.name}
            id="concept-name"
            required
          />
        </td>
        <td>
          <select
            id="locale_preferred"
            name="locale_preferred"
            value={this.state.locale_preferred}
            className="form-control"
            onChange={this.handleChange}
          >
            <option>No</option>
            <option>Yes</option>
          </select>
        </td>
        <td>
          <a
            href="#!"
            className="concept-form-table-link"
            id="remove-name"
            onClick={event => this.handleRemove(event, this.props.newRow)}
          >
            remove
          </a>
        </td>
      </tr>
    );
  }
}

export default ConceptNameRows;
