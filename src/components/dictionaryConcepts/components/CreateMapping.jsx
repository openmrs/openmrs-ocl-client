import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AsyncSelect from 'react-select/lib/Async';
import PropTypes from 'prop-types';
import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';
import { fetchSourceConcepts } from '../../../redux/actions/concepts/dictionaryConcepts';
import { INTERNAL_MAPPING_DEFAULT_SOURCE } from './helperFunction';
import MapType from './MapType';

class CreateMapping extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleInputChange = (value) => {
    this.setState({ inputValue: value });
  }

  sourceNameToUpperCase = source => source.trim().toUpperCase();

  render() {
    const { inputValue } = this.state;
    const {
      map_type, source, to_concept_code, to_concept_name, index,
      updateEventListener, removeMappingRow, updateAsyncSelectValue,
      isNew, updateAutoCompleteListener, allSources,
    } = this.props;
    const mappingSources = allSources.map(src => src.name);
    const customEvent = {
      target: {
        tabIndex: index,
        name: 'source',
        value: '',
      },
    };
    let matchingSrc;
    if (source) {
      matchingSrc = allSources.filter(
        src => src.url.trim().toUpperCase() === source.trim().toUpperCase(),
      );
    }

    return (
      <tr>
        <td>
          {!isNew && (matchingSrc && matchingSrc.length > 0 ? matchingSrc[0].name : source)}
          {
            isNew && <TextInput
              id="source"
              tabIndex={index}
              className="form-control"
              placeholder="source"
              type="text"
              name="source"
              onChange={(event) => { updateAutoCompleteListener(event, customEvent); }}
              trigger=""
              regex="^[a-zA-Z0-9_\-/]+$"
              matchAny
              maxOptions={10}
              options={mappingSources}
              defaultValue={source || ''}
            />
        }
        </td>
        <td>
          {<MapType
            updateEventListener={updateEventListener}
            index={index}
            map_type={map_type}
            source={source}
          />}

          {source && this.sourceNameToUpperCase(source) !== INTERNAL_MAPPING_DEFAULT_SOURCE && (
            <div className="row concept-code">
              <div className="col-2"> Code</div>
              <div className="col-10">
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
        </td>

        <td className="react-async">
          {!isNew && to_concept_name}
          {source && this.sourceNameToUpperCase(source) === INTERNAL_MAPPING_DEFAULT_SOURCE ? (
            isNew && <AsyncSelect
              cacheOptions
              isClearable
              loadOptions={async () => fetchSourceConcepts(
                this.sourceNameToUpperCase(source),
                inputValue,
                index,
              )}
              onChange={updateAsyncSelectValue}
              onInputChange={this.handleInputChange}
              placeholder="search concept name"
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
          <Link id="remove" tabIndex={index} onClick={removeMappingRow} to="#">
              remove
          </Link>
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
  updateAutoCompleteListener: PropTypes.func.isRequired,
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
