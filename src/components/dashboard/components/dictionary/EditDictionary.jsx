import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DictionaryModal from './common/DictionaryModal';
import {
  fetchingOrganizations,
  editDictionary,
} from '../../../../redux/actions/dictionaries/dictionaryActionCreators';
import languages from './common/Languages';

export class EditDictionary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultLocaleOption: '',
      supportedLocalesOptions: [],
    };
  }

  componentDidMount() {
    this.preSelectDefaultLocale();
    this.preSelectSupportedLocales();
  }

  preSelectDefaultLocale = () => {
    const { dictionary } = this.props;
    for (let i = 0; i < languages.length; i += 1) {
      if (languages[i].value === dictionary.default_locale) {
        const option = (<option value={languages[i].value} selected>
          {languages[i].label}
        </option>);
        this.setState({
          ...this.state,
          defaultLocaleOption: option,
        });
      }
    }
    return null;
  }

  preSelectSupportedLocales = () => {
    const {
      dictionary: {
        supported_locales,
      },
    } = this.props;
    if (!supported_locales) {
      return null;
    }
    const supportedLocalesOptions = [];
    for (let i = 0; i < supported_locales.length; i += 1) {
      for (let j = 0; j < languages.length; j += 1) {
        if (supported_locales[i] === languages[j].value) {
          supportedLocalesOptions.push(languages[j]);
        }
      }
    }
    this.setState({
      ...this.state,
      supportedLocalesOptions,
    });
    return null;
  }

  submit = (data) => {
    const {
      dictionary: {
        url,
      },
    } = this.props;
    return this.props.editDictionary(url, data);
  }
  render() {
    return (
      <DictionaryModal
        title="Edit Dictionary"
        buttonname="Update Dictionary"
        show={this.props.show}
        modalhide={this.props.handleHide}
        submit={this.submit}
        dictionary={this.props.dictionary}
        defaultLocaleOption={this.state.defaultLocaleOption}
        isEditingDictionary
        supportedLocalesOptions={this.state.supportedLocalesOptions}
      />
    );
  }
}
EditDictionary.propTypes = {
  handleHide: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  editDictionary: PropTypes.func.isRequired,
  dictionary: PropTypes.object.isRequired,
};


export default connect(null, {
  fetchingOrganizations,
  editDictionary,
})(EditDictionary);
