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

  preSelectDefaultLocale = () => {
    const { dictionary } = this.props;
    for (let i = 0; i < languages.length; i++) { // eslint-disable-line
      if (languages[i].value === dictionary.default_locale) {
        return (<option value={languages[i].value} selected>
          {languages[i].label}
        </option>);
      }
    }
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
        preSelectDefaultLocale={this.preSelectDefaultLocale}
        isEditingDictionary
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
