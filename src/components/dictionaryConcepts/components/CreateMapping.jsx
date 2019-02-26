import React, { Component } from 'react';
import AsyncSelect from 'react-select/lib/Async';
import PropTypes from 'prop-types';
import { fetchSourceConcepts } from '../../../redux/actions/concepts/dictionaryConcepts';
import { INTERNAL_MAPPING_DEFAULT_SOURCE, CIEL_SOURCE_URL } from './helperFunction';
import MapType from './MapType';

class CreateMapping extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleInputChange = (value) => {
    this.setState({ inputValue: value });
  }

  render() {
    const { inputValue } = this.state;
    const {
      map_type, source, to_concept_code, to_concept_name, index,
      updateEventListener, removeMappingRow, updateAsyncSelectValue,
      isNew, allSources,
    } = this.props;

    return (
      <tr>
        <td>
          {<select
            id="source"
            tabIndex={index}
            className="form-control"
            name="source"
            onChange={updateEventListener}
            defaultValue={isNew ? '' : source}
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
          {<MapType
            updateEventListener={updateEventListener}
            index={index}
            map_type={map_type}
            source={source}
          />}
        </td>

        <td className="react-async">
          {!isNew && to_concept_name}
          {source && source !== INTERNAL_MAPPING_DEFAULT_SOURCE && (
            <div className="row concept-code">
              <div className="col-12 mb-2">
                <input
                  tabIndex={index}
                  defaultValue={to_concept_code}
                  className="form-control"
                  placeholder="To concept code"
                  type="text"
                  name="to_concept_code"
                  id="to_concept_code"
                  onChange={updateEventListener}
                />
              </div>
            </div>
          )}
          {source && source === INTERNAL_MAPPING_DEFAULT_SOURCE ? (
            isNew && <AsyncSelect
              cacheOptions
              isClearable
              loadOptions={async () => fetchSourceConcepts(
                source,
                inputValue,
                index,
              )}
              onChange={updateAsyncSelectValue}
              onInputChange={this.handleInputChange}
              placeholder="search concept name or id"
            />
          ) : (
            isNew && <input
              tabIndex={index}
              defaultValue={to_concept_name}
              className="form-control"
              placeholder="Concept name (optional)"
              type="text"
              name="to_concept_name"
              onChange={updateEventListener}
            />
          )}
        </td>

        <td className="table-remove-link">
          <button
            id="remove"
            className="btn btn-danger "
            tabIndex={index}
            onClick={removeMappingRow}
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
  index: PropTypes.number,
  updateEventListener: PropTypes.func,
  removeMappingRow: PropTypes.func,
  updateAsyncSelectValue: PropTypes.func,
  isNew: PropTypes.bool,
  allSources: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

CreateMapping.defaultProps = {
  map_type: '',
  source: '',
  to_concept_code: '',
  to_concept_name: '',
  index: 0,
  isNew: false,
  updateEventListener: () => {},
  removeMappingRow: () => {},
  updateAsyncSelectValue: () => {},
};

export default CreateMapping;
