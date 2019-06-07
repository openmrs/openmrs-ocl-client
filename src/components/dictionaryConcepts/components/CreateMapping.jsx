import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { notify } from 'react-notify-toast';
import {
  fetchConceptsFromASource,
} from '../../../redux/actions/concepts/dictionaryConcepts';
import {
  KEY_CODE_FOR_ENTER,
  isExternalSource,
} from './helperFunction';
import MapType from './MapType';

class CreateMapping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      internalConceptOptions: [],
      isInternalConceptOptionsListVisible: false,
      internalConceptSearchQuery: '',
      conceptsLoading: false,
    };
  }

  componentWillMount() {
    const { to_concept_name: toConceptName } = this.props;
    this.setState({
      internalConceptSearchQuery: toConceptName,
    });
  }

  handleKeyPress = async (event, inputValue, url) => {
    this.setState({
      isInternalConceptOptionsListVisible: false,
    });

    if (event.keyCode === KEY_CODE_FOR_ENTER) {
      if (inputValue && inputValue.length > 2) {
        this.setState({
          internalConceptOptions: [],
          isInternalConceptOptionsListVisible: false,
          conceptsLoading: true,
        });
        const internalConceptOptions = await fetchConceptsFromASource(url, inputValue);
        this.setState({
          internalConceptOptions,
          isInternalConceptOptionsListVisible: true,
          conceptsLoading: false,
        });
      } else {
        notify.show('Query must have at least three characters', 'warning', 2000);
      }
    }
  };

  selectInternalMapping(concept, url) {
    const toConceptName = `ID(${concept.id}) - ${concept.display_name}`;

    this.setState({
      isInternalConceptOptionsListVisible: false,
      internalConceptSearchQuery: toConceptName,
    });
    const { updateEventListener } = this.props;
    updateEventListener({
      target: {
        value: toConceptName,
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
    const {
      isInternalConceptOptionsListVisible,
      internalConceptOptions,
      internalConceptSearchQuery,
      conceptsLoading,
    } = this.state;
    const {
      map_type, sourceObject, to_concept_code, to_concept_name, index,
      updateEventListener, updateSourceEventListener, removeMappingRow,
      allSources, url,
    } = this.props;

    return (
      <tr>
        <td>
          {<select
            id="source"
            tabIndex={index}
            className="form-control"
            name="source"
            onChange={(event) => {
              updateSourceEventListener(event, url, allSources[event.target.selectedIndex - 1]);
            }}
            value={sourceObject.url || undefined}
          >
            <option value="" hidden>Select a source</option>
            {allSources.map(src => <option
              key={src.url}
              value={src.url}
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
              map_type={map_type}
            />
          }

        </td>

        <td className="react-async">
          {sourceObject && isExternalSource(sourceObject) && (
            <div className="row concept-code">
              <div className="col-12 mb-2">
                <input
                  autoComplete="off"
                  tabIndex={index}
                  value={to_concept_name || ''}
                  className="form-control"
                  placeholder="Concept name (optional)"
                  type="text"
                  id={`to-concept-name-${url}`}
                  name="to_concept_name"
                  onChange={(event) => { updateEventListener(event, url); }}
                />
              </div>
              <div className="col-12 mb-2">
                <input
                  autoComplete="off"
                  tabIndex={index}
                  value={to_concept_code || ''}
                  className="form-control"
                  placeholder="To concept code"
                  type="text"
                  name="to_concept_code"
                  id="to_concept_code"
                  onChange={(event) => { updateEventListener(event, url); }}
                />
              </div>
            </div>
          )}
          {sourceObject && !isExternalSource(sourceObject) && (
            <div className="concept-code">
              <span className={conceptsLoading ? 'loading' : ''}>
                <input
                  autoComplete="off"
                  tabIndex={index}
                  value={internalConceptSearchQuery || ''}
                  className="form-control"
                  placeholder={sourceObject.name ? `Search concepts in ${sourceObject.name}` : 'Select a source to add a concept'}
                  id={`to-concept-name-${url}`}
                  type="text"
                  onChange={(event) => {
                    this.setState({ internalConceptSearchQuery: event.target.value });
                  }}
                  onKeyDown={(event) => {
                    this.handleKeyPress(event, internalConceptSearchQuery, sourceObject.url, false);
                  }}
                />
              </span>
            </div>
          )}
          {isInternalConceptOptionsListVisible && (
            <div className="position-relative">
              <ul className="cielConceptsList search-results">
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
              </ul>
            </div>
          )}
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
  to_concept_code: PropTypes.string,
  to_concept_name: PropTypes.string,
  url: PropTypes.string,
  index: PropTypes.number,
  updateEventListener: PropTypes.func,
  updateSourceEventListener: PropTypes.func,
  removeMappingRow: PropTypes.func,
  isNew: PropTypes.bool,
  allSources: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isShown: PropTypes.bool,
  sourceObject: PropTypes.object,
};

CreateMapping.defaultProps = {
  map_type: '',
  sourceObject: {},
  to_concept_code: '',
  to_concept_name: '',
  index: 0,
  isNew: false,
  url: '',
  updateEventListener: () => {},
  updateSourceEventListener: () => {},
  removeMappingRow: () => {},
  isShown: false,
};

export default CreateMapping;
