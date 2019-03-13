import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Select from 'react-select';
import PropTypes from 'prop-types';
import locale from '../../dashboard/components/dictionary/common/Languages';

class ConceptNameRows extends Component {
  static propTypes = {
    newRow: PropTypes.object,
    nameRows: PropTypes.array,
    index: PropTypes.number,
    addDataFromRow: PropTypes.func.isRequired,
    removeRow: PropTypes.func.isRequired,
    removeDataFromRow: PropTypes.func.isRequired,
    pathName: PropTypes.object.isRequired,
    // eslint-disable-next-line react/require-default-props
    existingConcept: PropTypes.object,
    rowId: PropTypes.string,
  };

  static defaultProps = {
    // eslint-disable-next-line react/default-props-match-prop-types
    newRow: {
      id: '',
      name: '',
      locale: 'en',
      locale_full: { value: 'en', label: 'English [en]' },
      locale_preferred: true,
      name_type: '',
    },
    index: 0,
    nameRows: [],
    rowId: '',
  };

  constructor(props) {
    super(props);
    const defaultLocale = locale.find(
      currentLocale => currentLocale.value === props.pathName.language,
    );
    const { rowId } = this.props;
    this.state = {
      id: rowId,
      name: '',
      locale: defaultLocale.value,
      locale_full: defaultLocale,
      locale_preferred: 'Yes',
      name_type: 'Fully Specified',
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
    const defaultLocale = locale.find(
      currentLocale => currentLocale.value === newRow.locale,
    ) || locale[0];
    this.setState({
      ...this.state,
      uuid: newRow.uuid || '',
      name: newRow.name || '',
      locale: newRow.locale || defaultLocale.value,
      locale_full: defaultLocale,
      name_type: newRow.name_type || 'Fully Specified',
      locale_preferred: newRow.locale_preferred || 'Yes',
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
      locale: selectedOptions.value,
      locale_full: selectedOptions,
    }, () => {
    });
    this.sendToTopComponent();
  }

  sendToTopComponent() {
    this.props.addDataFromRow(this.state);
  }

  handleRemove(event, id) {
    const {
      removeRow,
      removeDataFromRow,
    } = this.props;
    removeRow(event, id);
    removeDataFromRow({ uuid: id }, 'names');
  }

  render() {
    const { rowId } = this.props;
    return (
      <tr>
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
            id="type"
            name="name_type"
            value={this.state.name_type}
            className="form-control"
            onChange={this.handleChange}
            required
          >
            <option />
            <option>Fully Specified</option>
            <option>Synonym</option>
            <option>Search Term</option>
          </select>
        </td>
        <th scope="row" className="concept-language">
          <Select
            id="locale_full"
            name="locale_full"
            value={this.state.locale_full}
            onChange={this.handleNameLocale}
            options={locale}
            required
          />
        </th>
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
          <button
            className="btn btn-danger concept-form-table-link"
            id="remove-name"
            type="button"
            onClick={event => this.handleRemove(event, rowId)}
          >
            remove
          </button>
        </td>
      </tr>
    );
  }
}

export default ConceptNameRows;
