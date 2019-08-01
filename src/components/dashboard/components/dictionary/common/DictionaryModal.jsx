import React from 'react';
import { connect } from 'react-redux';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input,
} from 'reactstrap';
import Select from 'react-select';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import InlineError from '../messages/InlineError';
import languages from './Languages';
import { getLoggedInUsername } from '../../../../../helperFunctions';

export class DictionaryModal extends React.Component {
  constructor(props) {
    super(props);
    const { organizations } = this.props;
    this.state = {
      data: {
        id: '',
        preferred_source: 'CIEL',
        public_access: 'View',
        name: '',
        owner: (organizations && organizations.length) ? '' : getLoggedInUsername(),
        custom_validation_schema: 'OpenMRS',
        description: '',
        default_locale: 'en',
        supported_locales: '',
        repository_type: 'OpenMRSDictionary',
        conceptUrl: '',
      },
      errors: {},
      disableButton: false,
      inputFocus: false,
    };
    this.nameInput = undefined;
  }

  componentDidMount() {
    const { isEditingDictionary } = this.props;
    if (isEditingDictionary) {
      this.populateFields();
      this.preSelectSupportedLocales();
    }
  }

  componentDidUpdate = () => {
    if (this.nameInput && !this.state.inputFocus) {
      this.focusInput(this.nameInput);
      this.setState({ inputFocus: true });
    }
  };

  focusInput = (input) => {
    input.focus();
  };

  onChange = (e) => {
    this.setState({
      data: {
        ...this.state.data,
        [e.target.name]: e.target.value,
      },
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate(this.state.data);
    this.setState({ errors });
    if (Object.keys(errors).length === 0) {
      this.props
        .submit(this.state.data)
        .then(() => this.hideModal())
        .catch((error) => {
          if (error.response) {
            this.setState({
              errors: error.response,
            });
          }
        });
    }
  };

  handleChangeSupportedLocale = (arr) => {
    const supported_locales = [];
    for (let i = 0; i < arr.length; i += 1) {
      supported_locales.push(arr[i].value);
    }
    this.setState({
      data: {
        ...this.state.data,
        supported_locales: supported_locales.toString(),
      },
    });
  };

 preSelectSupportedLocales = () => {
   const {
     dictionary: {
       supported_locales,
     },
   } = this.props;
   if (supported_locales === undefined || supported_locales === null) {
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
   return supportedLocalesOptions;
 }

  validate = (data) => {
    const errors = {};
    if (!data.name) {
      errors.name = 'Required';
    }
    if (!data.id) {
      errors.id = 'Required';
    }
    if (!data.preferred_source) {
      errors.preferred_source = 'Required';
    }
    if (!data.owner) {
      errors.owner = 'Required';
    }
    if (!data.public_access) {
      errors.public_access = 'Required';
    }
    if (!data.default_locale) {
      errors.default_locale = 'Required';
    }
    if (
      data.supported_locales.split(',').map(
        item => item.trim(),
      ).indexOf(data.default_locale) !== -1) {
      errors.supported_locales = 'Preferred language must not be included in other languages';
    }
    return errors;
  };

  addDictionary = (e) => {
    const errors = this.validate(this.state.data);
    if (Object.keys(errors).length === 0) {
      this.setState({ disableButton: true });
    }
    this.onSubmit(e);
  }

  hideModal = () => {
    this.setState({
      errors: {},
      disableButton: false,
      inputFocus: false,
    });
    this.props.modalhide();
  }

  populateFields() {
    const {
      dictionary: {
        id, preferred_source, public_access, name, owner, description,
        default_locale, repository_type,
      },
    } = this.props;
    this.setState({
      data: {
        id,
        preferred_source,
        public_access,
        name,
        owner,
        description,
        default_locale,
        supported_locales: '',
        repository_type,
      },
      errors: {},
    });
  }

  setNameInput = (input) => {
    this.nameInput = input;
  }

  render() {
    const { data, errors, disableButton } = this.state;
    const {
      organizations, dictionary,
      isEditingDictionary,
    } = this.props;
    return (
      <div>
        <Modal
          isOpen={this.props.show}
          onClosed={this.hideModal}
          className="modal-lg"
          backdrop="static"
        >
          <ModalHeader className="modal-heading" toggle={this.hideModal}>
            {this.props.title}
          </ModalHeader>
          {errors && <InlineError text={this.errors} />}
          <ModalBody>
            <form>
              <div>
                <div>
                  <FormGroup style={{ marginTop: '12px' }}>
                    Dictionary Name
                    {' '}
                    <b className="text-danger">*</b>
                    {''}
                    {errors && <InlineError text={errors.name} />}
                    <Input
                      type="text"
                      id="dictionary_name"
                      onChange={this.onChange}
                      name="name"
                      placeholder="e.g Community Health Dictionary"
                      value={data.name}
                      required
                      innerRef={input => this.setNameInput(input)}
                    />
                  </FormGroup>
                  <FormGroup
                    style={{ marginTop: '12px' }}
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Short Code"
                  >
                    Short Code
                    {' '}
                    <b className="text-danger">*</b>
                    {errors && <InlineError text={errors.id} />}
                    <Input
                      type="text"
                      id="dictionary_short_code"
                      name="id"
                      onChange={this.onChange}
                      value={data.id}
                      placeholder="
                      Mnemonic used to identify the collection
                       in the URL (an acronym e.g. Community-MCH)
                      "
                      required
                      disabled={isEditingDictionary !== true ? isEditingDictionary : true}
                    />
                    <ReactTooltip place="top" effect="solid" />
                  </FormGroup>
                  <FormGroup style={{ marginTop: '12px' }}>
                    Description
                    {' '}
                    <Input
                      type="textarea"
                      id="dictionary_description"
                      name="description"
                      placeholder="e.g Description of this dictionary"
                      onChange={this.onChange}
                      value={data.description}
                    />
                  </FormGroup>
                  <FormGroup style={{ marginTop: '12px' }}>
                    Preferred Source
                    {' '}
                    <b className="text-danger">*</b>
                    {' '}
                    {errors && <InlineError text={errors.preferred_source} />}
                    <Input
                      type="select"
                      id="preferred_source"
                      name="preferred_source"
                      onChange={this.onChange}
                      value={data.preferred_source}
                    >
                      <option value="CIEL">CIEL (default source)</option>
                    </Input>
                  </FormGroup>
                  <FormGroup style={{ marginTop: '12px' }}>
                    Owner
                    {' '}
                    <b className="text-danger">*</b>
                    {errors && <InlineError text={errors.owner} />}
                    <Input
                      type={isEditingDictionary ? 'text' : 'select'}
                      id="owner"
                      placeholder="Individual/ Organisation"
                      name="owner"
                      onChange={this.onChange}
                      value={data.owner}
                      disabled={isEditingDictionary}
                    >
                      { organizations && organizations.length !== 0 && <option value="" />}
                      <option value={localStorage.getItem('username')}>
                        {' '}
                        {localStorage.getItem('username')}
                        {' '}
                        (Yourself)
                        {' '}
                      </option>
                      {organizations
                      && organizations.map(organization => (
                        <option value={organization.id} key={organization.id}>
                          {organization.id}
                          {' '}
                          {' '}
                          (organization)
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                  <FormGroup style={{ marginTop: '12px' }}>
                    Visibility
                    {' '}
                    <b className="text-danger">*</b>
                    {''}
                    {errors && <InlineError text={errors.public_access} />}
                    <Input
                      type="select"
                      id="public_access"
                      placeholder="Private"
                      name="public_access"
                      onChange={this.onChange}
                      value={data.public_access}
                    >
                      <option value="View">Public</option>
                      <option value="None">Private</option>
                    </Input>
                  </FormGroup>
                  <FormGroup style={{ marginTop: '12px' }}>
                    Preferred Language
                    {' '}
                    <b className="text-danger">*</b>
                    {''}
                    {errors && <InlineError text={errors.default_locale} />}
                    <Input
                      type="select"
                      name="default_locale"
                      id="default_locale"
                      placeholder="English"
                      onChange={this.onChange}
                      value={data.default_locale}
                    >
                      {languages
                      && languages.map(language => (
                        <option value={language.value} key={language.value}>
                          { language.label }
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                  {'Other Languages'}
                  {errors && <InlineError text={errors.supported_locales} />}
                  <Select
                    id="supported_locales"
                    closeMenuOnSelect={false}
                    defaultValue={
                      isEditingDictionary
                        ? this.preSelectSupportedLocales()
                        : []}
                    options={
                      languages.filter(
                        language => language.value !== this.state.data.default_locale,
                      )
                    }
                    isMulti
                    onChange={this.handleChangeSupportedLocale}
                  />
                  <FormGroup>
                    <Input
                      type="hidden"
                      id="repository_type"
                      name="repository_type"
                      value="OpenMRSDictionary"
                    />
                  </FormGroup>
                </div>
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn btn-primary"
              id="addDictionary"
              onClick={this.addDictionary}
              disabled={disableButton}
            >
              {this.props.buttonname}
              {' '}
            </Button>
            <Button
              className="btn btn-danger test-btn-cancel"
              id="cancel"
              onClick={this.hideModal}
              disabled={disableButton}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
DictionaryModal.propTypes = {
  title: PropTypes.string,
  show: PropTypes.bool,
  buttonname: PropTypes.string,
  submit: PropTypes.func.isRequired,
  organizations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
  })),
  dictionary: PropTypes.object,
  modalhide: PropTypes.func.isRequired,
  defaultLocaleOption: PropTypes.object,
  isEditingDictionary: PropTypes.bool,
};

DictionaryModal.defaultProps = {
  title: 'Add Dictionary',
  show: false,
  buttonname: 'Add Dictionary',
  organizations: [],
  dictionary: {},
  isEditingDictionary: false,
  defaultLocaleOption: {},
};

function mapStateToProps(state) {
  return {
    organizations: state.user.userOrganization,
  };
}
export default connect(
  mapStateToProps,
)(DictionaryModal);
