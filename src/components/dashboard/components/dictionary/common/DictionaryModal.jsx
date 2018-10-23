import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal, FormGroup, FormControl } from 'react-bootstrap';
import Select from 'react-select';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { fetchingOrganizations, searchDictionaries } from '../../../../../redux/actions/dictionaries/dictionaryActionCreators';
import InlineError from '../messages/InlineError';
import languages from './Languages';

export class DictionaryModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        id: '',
        preferred_source: 'CIEL',
        public_access: '',
        name: '',
        owner: '',
        description: '',
        default_locale: 'en',
        supported_locales: '',
        repository_type: 'OpenMRSDictionary',
        conceptUrl: '',
      },
      errors: {},
      supportedLocalesOptions: [],
    };
  }
  componentDidMount() {
    this.props.fetchingOrganizations();
    const { isEditingDictionary } = this.props;
    if (isEditingDictionary) {
      this.populateFields();
      this.preSelectSupportedLocales();
    }
  }

  onChange = (e) => {
    const { organizations } = this.props;
    const { owner } = this.state.data;
    this.setState({
      data: {
        ...this.state.data,
        owner: (organizations && organizations.length === 0) ? 'Individual' : owner,
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
        .then(() => {
          this.props.modalhide();
        })
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

  populateFields() {
    const {
      dictionary: {
        id, preferred_source, public_access, name, owner, description,
        default_locale, repository_type,
      },
    } = this.props;
    const supportedLocalesOptions = this.preSelectSupportedLocales();
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
      supportedLocalesOptions,
    });
  }

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

 searchInputValues = (val) => {
   if (val.length > 0 && val[0] !== '*' && val[0] !== '.') {
     this.props.searchDictionaries(val);
   }
 }

 handleCopyDictionary = (item) => {
   this.setState({
     data: {
       ...this.state.data,
       conceptUrl: item.value,
     },
   });
 }

  validate = (data) => {
    const errors = {};
    if (!data.name) {
      errors.name = 'Dictionary Name cannot be empty';
    }
    if (!data.id) {
      errors.id = 'Short code cannot be empty';
    }
    if (!data.preferred_source) {
      errors.preferred_source = 'Kindly select the preferred source';
    }
    if (!data.owner) {
      errors.owner = 'Kindly select the Owner of the Dictionary';
    }
    if (!data.public_access) {
      errors.public_access =
        'Kindly select the Permissions for your dictionary';
    }
    if (!data.default_locale) {
      errors.default_locale = 'Kindly select your preferred locale';
    }
    if (data.supported_locales.split(',').map(item => item.trim()).indexOf(data.default_locale) !== -1) {
      errors.supported_locales = 'Preferred language must not be included in other languages';
    }
    return errors;
  };

  render() {
    const { data, errors } = this.state;
    const {
      organizations, dictionary,
      isEditingDictionary,
    } = this.props;
    const publicSources = [];
    return (
      <div>
        <Modal
          show={this.props.show}
          onHide={this.props.modalhide}
          dialogClassName="dictionary-custom-modal"
          className="dictionary-modal-fade"
        >
          <Modal.Header>
            <Modal.Title className="modal-heading">
              {this.props.title}
            </Modal.Title>
          </Modal.Header>
          {errors && <InlineError text={this.errors} />}
          <Modal.Body>
            <form>
              <div>
                <div>
                  <FormGroup style={{ marginTop: '12px' }}>
                    Preferred Source{' '}
                    {errors && <InlineError text={errors.preferred_source} />}
                    <FormControl
                      componentClass="select"
                      type="text"
                      id="preferred_source"
                      name="preferred_source"
                      onChange={this.onChange}
                      value={data.preferred_source}
                    >
                      <option value="CIEL">CIEL (default source)</option>
                      <option value="PIH">PIH</option>
                      {
                        isEditingDictionary &&
                        <option value={dictionary.preferred_source} selected>
                          {dictionary.preferred_source}
                        </option>
                      }
                      {
                        publicSources.sort((a, b) => a.name > b.name).map(source => (
                          <option value={source.id}>{source.name}</option>
                        ))
                      }
                    </FormControl>
                  </FormGroup>
                  <FormGroup style={{ marginTop: '12px' }}>
                    Preferred Language{''}
                    {errors && <InlineError text={errors.default_locale} />}
                    <FormControl
                      componentClass="select"
                      type="text"
                      name="default_locale"
                      id="default_locale"
                      placeholder="English"
                      onChange={this.onChange}
                    >
                      {isEditingDictionary &&
                        this.props.defaultLocaleOption
                      }
                      {languages &&
                      languages.map(language => (
                        <option value={language.value} key={language.value}>
                          { language.label }
                        </option>
                      ))}
                    </FormControl>
                  </FormGroup>
                  {'Other Languages'}
                  {errors && <InlineError text={errors.supported_locales} />}
                  <Select
                    id="supported_locales"
                    closeMenuOnSelect={false}
                    defaultValue={
                      isEditingDictionary ?
                      this.state.supportedLocalesOptions :
                      []}
                    options={
                      languages.filter(language =>
                        language.value !== this.state.data.default_locale)
                    }
                    isMulti
                    onChange={this.handleChangeSupportedLocale}
                  />
                  <FormGroup style={{ marginTop: '12px' }}>
                    Visibility{''}
                    {errors && <InlineError text={errors.public_access} />}
                    <FormControl
                      componentClass="select"
                      type="text"
                      id="public_access"
                      placeholder="Private"
                      name="public_access"
                      onChange={this.onChange}
                      value={data.public_access}
                    >
                      <option value="" />
                      {(isEditingDictionary && dictionary.public_access === 'None') &&
                      <option value="None" selected>None </option>
                      }
                      <option value="View">View</option>
                      <option value="None">None</option>
                    </FormControl>
                  </FormGroup>

                  <FormGroup style={{ marginTop: '12px' }}>
                    Dictionary Name{''}
                    {errors && <InlineError text={errors.name} />}
                    <FormControl
                      type="text"
                      id="dictionary_name"
                      onChange={this.onChange}
                      name="name"
                      placeholder="e.g Community Health Dictionary"
                      value={data.name}
                      required
                    />
                  </FormGroup>
                  <FormGroup style={{ marginTop: '12px' }}>
                    Owner {errors && <InlineError text={errors.owner} />}
                    <FormControl
                      componentClass="select"
                      type="text"
                      id="owner"
                      placeholder="Individual"
                      name="owner"
                      onChange={this.onChange}
                      value={data.owner}
                    >
                      {isEditingDictionary &&
                      <option value={data.owner} selected>{data.owner}</option>
                      }
                      { organizations && organizations.length !== 0 && <option value="" />}
                      <option value="Individual" style={{ textTransform: 'capitalize' }}> {localStorage.getItem('username')} (Yourself) </option>
                      {organizations &&
                        organizations.map(organization => (
                          <option value={organization.id} key={organization.id}>
                            {organization.id}{' '} (organization)
                          </option>
                        ))}
                    </FormControl>
                  </FormGroup>
                  <FormGroup
                    style={{ marginTop: '12px' }}
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Short Code"
                  >
                    Short Code
                    {errors && <InlineError text={errors.id} />}
                    <FormControl
                      type="text"
                      id="dictionary_short_code"
                      name="id"
                      onChange={this.onChange}
                      value={data.id}
                      placeholder="Mnemonic used to identify the collection in the URL (an acronym e.g. Community-MCH)"
                      required
                      disabled={isEditingDictionary !== true ? isEditingDictionary : true}
                    />
                    <ReactTooltip place="top" effect="solid" />
                  </FormGroup>
                  <FormGroup style={{ marginTop: '12px' }}>
                    Description{' '}
                    <FormControl
                      componentClass="textarea"
                      id="dictionary_description"
                      name="description"
                      placeholder="e.g Description of this dictionary"
                      onChange={this.onChange}
                      value={data.description}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControl
                      type="hidden"
                      id="repository_type"
                      name="repository_type"
                      value="OpenMRSDictionary"
                    />
                  </FormGroup>
                  {!isEditingDictionary &&
                  <FormGroup>
                    {'Start by copying another dictionary'}
                    <Select
                      id="copy_dictionary"
                      closeMenuOnSelect={false}
                      options={[...this.props.userDictionaries, ...this.props.dictionaries]}
                      onChange={val => this.handleCopyDictionary(val)}
                      onInputChange={val => this.searchInputValues(val)}
                      placeholder="Search public dictionaries"
                    />
                  </FormGroup>
                  }
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn btn-outline-info"
              id="addDictionary"
              onClick={this.onSubmit}
            >
              {this.props.buttonname}{' '}
            </Button>
            <Button
              className="btn btn-outline-danger test-btn-cancel"
              id="cancel"
              onClick={this.props.modalhide}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
DictionaryModal.propTypes = {
  title: PropTypes.string,
  show: PropTypes.bool,
  buttonname: PropTypes.string,
  fetchingOrganizations: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  organizations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
  })),
  dictionary: PropTypes.object,
  modalhide: PropTypes.func.isRequired,
  defaultLocaleOption: PropTypes.object,
  isEditingDictionary: PropTypes.bool,
  searchDictionaries: PropTypes.func.isRequired,
  dictionaries: PropTypes.array.isRequired,
  userDictionaries: PropTypes.array.isRequired,
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
    dictionaries: state.dictionaries.dictionaries
      .map(({ name, concepts_url }) => ({ label: name, value: concepts_url })),
    userDictionaries: state.user.userDictionary
      .map(({ name, concepts_url }) => ({ label: name, value: concepts_url })),
    organizations: state.organizations.organizations,
  };
}
export default connect(
  mapStateToProps,
  { fetchingOrganizations, searchDictionaries },
)(DictionaryModal);
