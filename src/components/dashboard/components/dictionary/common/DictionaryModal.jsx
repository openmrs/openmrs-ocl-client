import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal, FormGroup, FormControl } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { fetchingOrganizations } from '../../../../../redux/actions/dictionaries/dictionaryActionCreators';
import InlineError from '../messages/InlineError';
import language from './Languages';

export class DictionaryModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        id: '',
        preffered_sources: '',
        public_access: '',
        name: '',
        owner: '',
        description: '',
        supported_locales: 'en, es',
        repository_type: 'OpenMRSDictionary',
      },
      errors: {},
    };
  }

  componentDidMount() {
    this.props.fetchingOrganizations();
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
        .catch((error) => {
          if (error.response) {
            this.setState({
              errors: error.response,
            });
          }
        });
    }
  };

  validate = (data) => {
    const errors = {};
    if (!data.name) {
      errors.name = 'Dictionary Name cannot be empty';
    }
    if (!data.id) {
      errors.id = 'Short code cannot be empty';
    }
    if (!data.preffered_sources) {
      errors.preffered_sources = 'Kindly select the preferred source';
    }
    if (!data.owner) {
      errors.owner = 'Kindly select the Owner of the Dictionary';
    }
    if (!data.public_access) {
      errors.public_access =
        'Kindly select the Permissions for your dictionary';
    }
    if (!data.supported_locales) {
      errors.supported_locales = 'Kindly select your preferred locale';
    }
    return errors;
  };

  render() {
    const { data, errors } = this.state;
    const { organizations } = this.props;
    return (
      <div className="col-sm-5">
        <Modal
          {...this.props}
          show={this.props.show}
          onHide={this.props.modalhide}
          dialogClassName="custom-modal"
          className="modal-fade"
        >
          <Modal.Header>
            <Modal.Title className="modal-heading">
              {this.props.title}
            </Modal.Title>
          </Modal.Header>
          {errors && <InlineError text={this.errors} />}
          <Modal.Body>
            <form style={{ marginLeft: '50px', marginRight: '-37%' }}>
              <div className="row">
                <div className="col-md-8">
                  <FormGroup style={{ marginTop: '12px' }}>
                    Preferred Sources{' '}
                    {errors && <InlineError text={errors.preffered_sources} />}
                    <FormControl
                      componentClass="select"
                      type="text"
                      id="preferred_sources"
                      name="preffered_sources"
                      placeholder="CIEL"
                      onChange={this.onChange}
                      value={data.preffered_sources}
                    >
                      <option value="" />
                      <option value="1">CIEL (default source)</option>
                    </FormControl>
                  </FormGroup>

                  <FormGroup style={{ marginTop: '12px' }}>
                    Preferred Language{''}
                    {errors && <InlineError text={errors.supported_locales} />}
                    <FormControl
                      componentClass="select"
                      type="text"
                      name="supported_locales"
                      id="supported_locales"
                      placeholder="English"
                      onChange={this.onChange}
                    >
                      {language &&
                      language.map(languages => (
                        <option value={languages.value} key={languages.value}>
                          { languages.label }
                        </option>
                      ))}
                    </FormControl>
                  </FormGroup>

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
                      <option value="View">Private </option>
                      <option value="Edit"> Public </option>
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
                      placeholder="e.g Community-MCH, Only Alphanumeric Characters
                      Allowed"
                      required
                    />
                  </FormGroup>
                  <FormGroup style={{ marginTop: '12px' }}>
                    Description{' '}
                    <FormControl
                      componentClass="textarea"
                      id="dictionary_description"
                      name="description"
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
  organizations: PropTypes.shape,
};

DictionaryModal.defaultProps = {
  title: 'Add Dictionary',
  show: false,
  buttonname: 'Add Dictionary',
};

function mapStateToProps(state) {
  return {
    organizations: state.organizations.organizations,
  };
}
export default connect(
  mapStateToProps,
  { fetchingOrganizations },
)(DictionaryModal);
