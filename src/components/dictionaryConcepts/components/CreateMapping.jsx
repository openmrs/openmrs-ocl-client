import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { notify } from 'react-notify-toast';
import {
  fetchConceptsFromASource,
  fetchSourceConcepts,
} from '../../../redux/actions/concepts/dictionaryConcepts';
import {
  INTERNAL_MAPPING_DEFAULT_SOURCE,
  MAP_TYPES_DEFAULTS,
  CIEL_SOURCE_URL,
  KEY_CODE_FOR_ENTER,
} from './helperFunction';
import MapType from './MapType';

class CreateMapping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '',
      editMapType: '',
      inputValue: this.props.to_concept_name || '',
      options: [],
      isVisible: false,
      internalConceptOptions: [],
      isInternalConceptOptionsListVisible: false,
    };
  }

  handleInputChange = (value) => {
    this.setState({ inputValue: value });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      type: nextProps.map_type,
    });
  }

  componentWillMount() {
    const editMapType = this.props.source;
    this.setState({
      editMapType,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.source !== this.props.source) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        type: '',
      });
    }
  }


  handleKeyPress = async (event, inputValue, url, isExternalMapping = true) => {
    this.setState({
      isInternalConceptOptionsListVisible: false,
    });

    if (event.keyCode === KEY_CODE_FOR_ENTER) {
      if (inputValue.length > 2) {
        if (isExternalMapping) {
          const options = await fetchSourceConcepts(
            INTERNAL_MAPPING_DEFAULT_SOURCE, inputValue, url,
          );
          this.setState({ options, isVisible: true });
        } else {
          this.setState({
            internalConceptOptions: [],
            isInternalConceptOptionsListVisible: false,
          });
          const internalConceptOptions = await fetchConceptsFromASource(url, inputValue);
          this.setState({
            internalConceptOptions,
            isInternalConceptOptionsListVisible: true,
          });
        }
      } else {
        notify.show('Query must have at least three characters', 'warning', 2000);
      }
    }
  };

  handleSelect = (res) => {
    this.setState({ isVisible: false, inputValue: res.label });
    this.props.updateAsyncSelectValue(res);
  };

  selectInternalMapping(concept, url) {
    this.setState({
      isInternalConceptOptionsListVisible: false,
    });
    const { updateEventListener } = this.props;
    updateEventListener({
      target: {
        value: concept.display_name,
        name: 'to_concept_name',
      },
    }, url);
    updateEventListener({
      target: {
        value: concept.id,
        name: 'to_concept_code',
      },
    }, url);
  }

  render() {
    const { inputValue, isInternalConceptOptionsListVisible, internalConceptOptions } = this.state;
    const {
      map_type, source, to_concept_code, to_concept_name, index,
      updateEventListener, updateSourceEventListener, removeMappingRow,
      isNew, allSources, url, isShown,
    } = this.props;
    const nullEditMapType = (source !== INTERNAL_MAPPING_DEFAULT_SOURCE ? this.state.type
      || MAP_TYPES_DEFAULTS[1] : this.state.type || MAP_TYPES_DEFAULTS[0]);

    return (
      <tr>
        <td>
          {<select
            id="source"
            tabIndex={index}
            className="form-control"
            name="source"
            onChange={(event) => { updateSourceEventListener(event, url); }}
            value={source || undefined}
          >
            <option value="" hidden>Select a source</option>
            {allSources.map(src => <option
              key={src.url}
              value={src.url === CIEL_SOURCE_URL ? INTERNAL_MAPPING_DEFAULT_SOURCE : src.url}
            >
              {src.name}
            </option>)}
          </select>}
        </td>
        <td>

          {
            <MapType
              updateEventListener={updateEventListener}
              url={url}
              index={index}
              map_type={this.state.editMapType === null ? nullEditMapType : map_type}
            />
          }

        </td>

        <td className="react-async">
          {!isNew && (source && source === INTERNAL_MAPPING_DEFAULT_SOURCE ? (
            <div className="conceptDetails">
              <input
                tabIndex={index}
                className="form-control"
                placeholder="search concept name or id"
                type="text"
                id="searchInputCiel"
                name="to_concept_name"
                value={inputValue}
                onChange={e => this.handleInputChange(e.target.value)
                }
                onKeyDown={e => this.handleKeyPress(e, inputValue, url)}
              />
              {(this.state.isVisible || isShown) && <ul className="cielConceptsList">
                  {this.state.options.map(result => <li key={result.label}>
                    <button
                      type="button"
                      id="selectMappingnotNew"
                      name="selectButton"
                      onClick={() => this.handleSelect(result)}
                    >
                      {result.label}
                    </button>
                  </li>)}
              </ul>}
            </div>
          ) : (
            <input
              tabIndex={index}
              defaultValue={to_concept_name}
              className="form-control"
              placeholder="Concept name (optional)"
              type="text"
              id="searchInputNotCiel"
              name="to_concept_name"
              onChange={(event) => { updateEventListener(event, url); }}
            />
          ))}
          {source && source !== INTERNAL_MAPPING_DEFAULT_SOURCE && (
            <div className="row concept-code">
              <div className="col-12 mb-2">
                <input
                  autoComplete="off"
                  tabIndex={index}
                  value={to_concept_code}
                  className="form-control"
                  placeholder="To concept code"
                  type="text"
                  name="to_concept_code"
                  id="to_concept_code"
                  onChange={(event) => { updateEventListener(event, url); }}
                  onKeyDown={event => this.handleKeyPress(event, to_concept_code, source, false)}
                />
              </div>
            </div>
          )}
          {source && source === INTERNAL_MAPPING_DEFAULT_SOURCE ? (
            isNew
            && <div className="conceptDetails">
              <input
                tabIndex={index}
                className="form-control"
                placeholder="search concept name or id"
                type="text"
                id="searchInputCielIsnew"
                name="to_concept_name"
                value={inputValue}
                onChange={e => this.handleInputChange(e.target.value)
                }
                onKeyDown={e => this.handleKeyPress(e, inputValue, url)}
              />
              {(this.state.isVisible || isShown) && <ul className="cielConceptsList">
                  {this.state.options.map(result => <li key={result.label}>
                    <button
                      type="button"
                      id="selectMappingNew"
                      onClick={() => this.handleSelect(result)}
                    >
                      {result.label}
                    </button>
                  </li>)}
              </ul>}
            </div>
          ) : (
            isNew
            && <input
              autoComplete="off"
              tabIndex={index}
              value={to_concept_name}
              className="form-control"
              placeholder="Concept name (optional)"
              id="ConceptName"
              type="text"
              name="to_concept_name"
              onChange={(event) => { updateEventListener(event, url); }}
              onKeyDown={event => this.handleKeyPress(event, to_concept_name, source, false)}
            />
          )}
          {isInternalConceptOptionsListVisible && <ul className="cielConceptsList">
            {internalConceptOptions.map(concept => <li key={concept.id}>
              <button
                type="button"
                id={`concept-id-${concept.id}`}
                name={`concept-name-${concept.id}`}
                onClick={() => this.selectInternalMapping(concept, url)}
              >
                {concept.display_name}
              </button>
            </li>)}
            {internalConceptOptions.length < 1 && <li className="message">No concepts matching this query</li>}
          </ul>}
        </td>

        <td className="table-remove-link">
          <button
            id="remove"
            className="btn btn-danger "
            tabIndex={index}
            onClick={() => removeMappingRow(url, to_concept_name, to_concept_code)}
            type="button"
          >
              remove
          </button>
        </td>
      </tr>
    );
  }
}

CreateMapping.propTypes = {
  map_type: PropTypes.string,
  source: PropTypes.string,
  to_concept_code: PropTypes.string,
  to_concept_name: PropTypes.string,
  url: PropTypes.string,
  index: PropTypes.number,
  updateEventListener: PropTypes.func,
  updateSourceEventListener: PropTypes.func,
  removeMappingRow: PropTypes.func,
  updateAsyncSelectValue: PropTypes.func,
  isNew: PropTypes.bool,
  allSources: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isShown: PropTypes.bool,
};

CreateMapping.defaultProps = {
  map_type: '',
  source: '',
  to_concept_code: '',
  to_concept_name: '',
  index: 0,
  isNew: false,
  url: '',
  updateEventListener: () => {},
  updateSourceEventListener: () => {},
  removeMappingRow: () => {},
  updateAsyncSelectValue: () => {},
  isShown: false,
};

export default CreateMapping;
