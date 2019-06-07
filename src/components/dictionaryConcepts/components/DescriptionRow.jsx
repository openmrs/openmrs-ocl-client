import React, { Component } from 'react';
import Select from 'react-select';
import autoBind from 'react-autobind';
import PropTypes from 'prop-types';
import locale from '../../dashboard/components/dictionary/common/Languages';

class DescriptionRow extends Component {
  static propTypes = {
    rowId: PropTypes.string,
    newRow: PropTypes.object,
    addDataFromDescription: PropTypes.func.isRequired,
    removeDescription: PropTypes.func.isRequired,
    removeDataFromRow: PropTypes.func.isRequired,
    pathName: PropTypes.object.isRequired,
    // eslint-disable-next-line react/require-default-props
    existingConcept: PropTypes.object,
  }

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
    const defaultLocale = locale.find(
      currentLocale => currentLocale.value === newRow.locale,
    );
    this.setState({
      ...this.state,
      uuid: newRow.uuid,
      locale: newRow.locale || 'en',
      locale_full: defaultLocale,
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
            rows="2"
            className="form-control concept-description"
            onChange={this.handleChange}
            name="description"
            value={this.state.description}
            id="concept-description"
            required
          />
        </td>
        <td className="concept-language">
          <Select
            name="locale_full"
            id="description-locale"
            value={this.state.locale_full}
            onChange={this.handleNameLocale}
            options={locale}
            required
          />
        </td>
        <td>
          <button
            href="#!"
            className=" btn btn-outline-danger concept-form-table-link"
            id="remove-description"
            type="button"
            onClick={event => this.handleRemove(event, this.props.newRow)}
          >
            remove
          </button>
        </td>
      </tr>
    );
  }
}

export default DescriptionRow;
