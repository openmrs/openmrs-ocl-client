import React from 'react';
import PropTypes from 'prop-types';
import CardBody from './CardBody';

const PreviewCard = ({ concept, closeModal, addConcept }) => {
  const {
    display_name, descriptions, mappings, display_locale, id, url,
  } = concept;

  const mapping = mappings ? mappings.length : 'none';
  return (
    <div className="pop-up-wrapper">
      <h6>{id}</h6>
      <div className="header-divider" />
      <p className="synonyms">
        Name{' '}
        <small>
          <em className="float-right">{display_locale}</em>
        </small>
      </p>
      <div className="pop-up-description rounded">{display_name}</div>
      <CardBody title="Description" body={descriptions[0].description} />
      <CardBody title="Mappings" body={mapping} />
      <div className="buttons text-right mt-3">
        <button className="btn btn-sm btn-danger no-shadow mr-2" onClick={closeModal}>
          Close
        </button>
        <button
          className="btn btn-sm btn-success no-shadow"
          id="add-concept"
          onClick={() => {
            addConcept(url, display_name);
            closeModal();
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
};

PreviewCard.propTypes = {
  closeModal: PropTypes.func.isRequired,
  addConcept: PropTypes.func.isRequired,
  concept: PropTypes.shape({
    display_name: PropTypes.string.isRequired,
    descriptions: PropTypes.array.isRequired,
    mappings: PropTypes.any,
    display_locale: PropTypes.string.isRequired,
  }).isRequired,
};

export default PreviewCard;
