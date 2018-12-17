import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import {
  Form,
  FormGroup,
  Input,
} from 'reactstrap';
import fetchCielConcepts, { addExistingBulkConcepts, isConceptValid } from '../../redux/actions/bulkConcepts';
import Header from './container/Header';
import ResultModal from './component/addBulkConceptResultModal';

export class AddBulkConcepts extends Component {
  static propTypes = {
    fetchCielConcepts: PropTypes.func.isRequired,
    addExistingBulkConcepts: PropTypes.func.isRequired,
    cielConcepts: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
    })).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        type: PropTypes.string,
        typeName: PropTypes.string,
        collectionName: PropTypes.string,
      }).isRequired,
    }).isRequired,
    isFetching: PropTypes.bool.isRequired,
    language: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      conceptIds: '',
      openResultModal: false,
    };
    this.invalidConceptIds = [];
    this.sourceUrl = 'orgs/CIEL/sources/CIEL/concepts/';
  }

  componentDidMount() {
    this.props.fetchCielConcepts();
  }

  handleSelected = (selected) => {
    const { conceptIds } = this.state;
    this.setState({ conceptIds: conceptIds ? `${conceptIds}, ${selected.id}` : selected.id });
  }

  handleCielClick = () => {
    this.props.fetchCielConcepts();
  };

  textChange = (e) => {
    this.setState({ conceptIds: e.target.value });
  }

  handleAddAll = async () => {
    const {
      match: {
        params: { type, typeName, collectionName },
      },
    } = this.props;
    const url = `${type}/${typeName}/collections/${collectionName}/references/`;
    const { conceptIds } = this.state;
    const conceptIdList = conceptIds.split(/[\s,\r\n]+/);

    if (conceptIdList[0]) {
      this.invalidConceptIds = [];

      const validConcepts = await conceptIdList.reduce(async (accumulator, id) => {
        const validity = await isConceptValid({ url: `${this.sourceUrl}${id}/` });
        if (validity[0]) {
          (await accumulator).push(`/${this.sourceUrl}${id}/`);
        } else {
          this.invalidConceptIds.push(id);
        }
        return accumulator;
      }, Promise.resolve([]));

      this.props.addExistingBulkConcepts({ url, data: { data: { expressions: validConcepts } } });
      this.setState({ conceptIds: '', openResultModal: this.invalidConceptIds.length > 0 });
    }
  }

  closeResultModal = () => {
    this.invalidConceptIds = [];
    this.setState({ openResultModal: false });
  }

  render() {
    const dictionaryName = localStorage.getItem('dictionaryName');
    const { conceptIds, openResultModal } = this.state;
    const {
      match: {
        params: { type, typeName, collectionName },
      },
      cielConcepts,
      language,
    } = this.props;

    const disableButton = (conceptIds.length < 1);

    return (
      <div className="container-fluid add-bulk-concepts custom-max-width">
        <ResultModal
          openModal={openResultModal}
          closeModal={this.closeResultModal}
          ids={this.invalidConceptIds}
        />
        <Header locationPath={this.props.match.params} />
        <h3>
          <strong>
            {dictionaryName}
            {' '}
Dictionary
          </strong>
: Bulk Add Concepts
        </h3>
        <div className="scheduler-border">
          <h3>Select a source</h3>
          <div className="select-box">

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="exampleRadios"
                id="ciel"
                value="option1"
                onClick={this.handleCielClick}
                defaultChecked
              />
              <label className="form-check-label" htmlFor="exampleRadios1">
                CIEL
              </label>
            </div>
            <br />
          </div>
          <br />
          <div className="row">
            <div className="col-md-6">
              <h3>Concept IDs to add</h3>
            </div>
            <div className="col-md-6 pull-right">
              <Downshift
                id="searchInput"
                onChange={selected => this.handleSelected(selected)}
                itemToString={item => item && item.display_name}
              >
                {({
                  getInputProps,
                  getItemProps,
                  getMenuProps,
                  highlightedIndex,
                  isOpen,
                  inputValue,
                }) => (
                  <div>
                    <div id="other-search">
                      <div className="form-check">
                        Quick search &nbsp;&nbsp;
                        <form className="form-inline search-bar">
                          <i className="fas fa-search" />
                          <input
                            {
                            ...getInputProps()
                            }
                            className="form-control search"
                            id="search"
                            placeholder="search"
                            aria-label="Search"
                          />
                        </form>
                      </div>
                    </div>
                    <div className="search-ul">
                      {isOpen ? (
                        <ul {...getMenuProps()} id="search-ul">
                          {
                          cielConcepts.filter(item => !inputValue.trim()
                          || item.display_name.toLowerCase()
                            .includes(inputValue.toLowerCase())).slice(1, 10).map((item, index) => (
                              <li
                                {...getItemProps({
                                  key: item.id,
                                  index,
                                  item,
                                  style: {
                                    backgroundColor:
                                    highlightedIndex === index ? 'lightgray' : 'white',
                                    padding: '5px 10px 1px',
                                  },
                                })}
                              >
                                {item.display_name}
                              </li>
                          ))
                        }
                        </ul>
                      )
                        : null}
                    </div>
                  </div>
                )}
              </Downshift>
            </div>
          </div>
          <div className="preferred-concepts">
            <Form className="bulkForm">
              <FormGroup>
                <Input type="textarea" name="text" id="idsText" value={conceptIds} rows="10" onChange={this.textChange} />
              </FormGroup>
            </Form>
          </div>
          <br />
          <div className="add-all-btn">
            <Link
              to={`/concepts/${type}/${typeName}/${collectionName}/${dictionaryName}/${language}/`}
              className="btn btn-secondary"
            >
              Cancel
            </Link>
            {' '}

            <button
              type="button"
              className="btn btn-primary btn-add-all"
              id="btn-add-all"
              onClick={this.handleAddAll}
              disabled={disableButton}
            >
              <i className="fa fa-plus" />
              {' '}
              Add
            </button>

          </div>
        </div>
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  cielConcepts: state.cielConcepts.cielConcepts,
  isFetching: state.cielConcepts.loading,
});
export default connect(
  mapStateToProps,
  { fetchCielConcepts, addExistingBulkConcepts },
)(AddBulkConcepts);
