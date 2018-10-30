import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select';
import autoBind from 'react-autobind';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';
import locale from '../../dashboard/components/dictionary/common/Languages';

class DescriptionRow extends Component {
  static propTypes = {
    newRow: PropTypes.shape({
      uuid: PropTypes.string,
      locale: PropTypes.string,
      description: PropTypes.string,
    }),
    addDataFromDescription: PropTypes.func.isRequired,
    removeDescription: PropTypes.func.isRequired,
    removeDataFromRow: PropTypes.func.isRequired,
    pathName: PropTypes.object.isRequired,
    existingConcept: PropTypes.object.isRequired,
  }

  static defaultProps = {
    newRow: {
      uuid: String(uuid()),
      locale: 'en',
      description: '',
    },
  }

  constructor(props) {
    super(props);
    const defaultLocale = locale.find(
      currentLocale => currentLocale.value === props.pathName.language,
    );
    this.state = {
      id: this.props.newRow,
      locale: defaultLocale.value,
      locale_full: defaultLocale,
      description: '',
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
      uuid: newRow.uuid,
      locale: newRow.locale || 'en',
      description: newRow.description,
    });
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
      locale_full: selectedOptions,
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
        <td>
          <textarea
            type="text"
            rows="3"
            className="form-control concept-description"
            onChange={this.handleChange}
            name="description"
            value={this.state.description}
            id="concept-description"
            required
          />
        </td>
        <th scope="row" className="concept-language">
          <Select
            name="locale_full"
            id="description-locale"
            value={this.state.locale_full}
            onChange={this.handleNameLocale}
            options={locale}
            required
          />
        </th>
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
