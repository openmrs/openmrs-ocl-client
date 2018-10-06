import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AddConceptModal from './ConceptModal';
import addExistingConcept from '../../../../redux/actions/concepts/addExistingConcepts/index';

const SpecificConceptTable = (props) => {
  const {
    concept: {
      id, concept_class, datatype, display_name, source, owner, url,
    },
  } = props;
  const handleAdd = () => {
    const expressions = [url];
    props.addExistingConcept({ data: { expressions } });
    localStorage.setItem('conceptName', display_name);
  };
  return (
    <tr className="concept-table">
      <td className="table1">{id}</td>
      <td className="table2">{display_name}</td>
      <td>
        {concept_class} / {datatype}
      </td>
      <td className="table3">
        <a href="_blank" onClick={() => handleAdd(props)} className="add-btn">
          {' '}
          Add{' '}
        </a>{' '}
        <a
          href="!#"
          className="add-btn"
          data-toggle="modal"
          data-target={`#conceptPreview${id}`}
        >
          Preview
        </a>
      </td>
      <AddConceptModal
        id={id}
        display_name={display_name}
        concept_class={concept_class}
        source={source}
        owner={owner}
        url={url}
        descriptions={
          props.concept.descriptions === null
            ? 'None'
            : props.concept.descriptions[0].description
        }
        locale={
          props.concept.descriptions === null
            ? 'None'
            : props.concept.descriptions[0].locale
        }
        names={
          props.concept.names === null
            ? 'None'
            : props.concept.names[0].name_type
        }
        mappings={
          props.concept.mappings === null ? 'None' : props.concept.mappings
        }
      />
    </tr>
  );
};

SpecificConceptTable.propTypes = {
  addExistingConcept: PropTypes.func.isRequired,
  concept: PropTypes.arrayOf(PropTypes.shape({
    owner: PropTypes.string,
  })).isRequired,
};
export default connect(
  null,
  { addExistingConcept },
)(SpecificConceptTable);
