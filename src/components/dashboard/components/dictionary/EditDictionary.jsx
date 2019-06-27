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
      defaultLocaleOption: {},
    };
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
