import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Modal, ModalBody, ModalFooter,
} from 'reactstrap';
import CardBody from './CardBody';
import MappingPreview from './MappingPreview';
import {
  MAP_TYPE,
  TRADITIONAL_OCL_HOST,
} from '../../dictionaryConcepts/components/helperFunction';

const getSetMembers = mappings => (
  mappings.filter(mapping => mapping.map_type === MAP_TYPE.conceptSet))
  .map(
    mapping => `<div>${mapping.to_concept_name}(${mapping.to_concept_code})</div>`,
  );

const getAnswers = mappings => (
  mappings.filter(mapping => mapping.map_type === MAP_TYPE.questionAndAnswer))
  .map(
    mapping => `<div>${mapping.to_concept_name}(${mapping.to_concept_code})</div>`,
  );

const getOtherMappings = mappings => (
  mappings.filter(
    mapping => (
      mapping.map_type !== MAP_TYPE.conceptSet)
      && (mapping.map_type !== MAP_TYPE.questionAndAnswer),
  )
);

const NUMBER_OF_ITEMS_TO_DISPLAY = 5;

const PreviewCard = ({
  open, concept, closeModal, addConcept,
}) => {
  const {
    display_name,
    descriptions,
    mappings,
    display_locale,
    id,
    url,
    concept_class,
    datatype,
    names,
  } = concept;

  const mapping = mappings || 'none';
  const description = descriptions ? descriptions[0].description : 'none';
  const synonyms = names && names
    .map(name => `<span className='synonym'>${name.name} (${name.locale})</span>`)
    .filter(name => name !== `<span className='synonym'>${display_name}</span>`)
    .join(' ');
  let setMembers;
  let answers;
  let otherMappings = mapping;
  let remainingCount;
  if (mapping !== 'none') {
    setMembers = getSetMembers(mapping);
    answers = getAnswers(mapping);
    otherMappings = getOtherMappings(mapping);
  }

  const displaySetMembersOrAnswers = () => {
    if (setMembers && setMembers.length > 0) {
      remainingCount = setMembers.length - NUMBER_OF_ITEMS_TO_DISPLAY;
      return <CardBody
        remainingCount={remainingCount}
        title="Set members"
        body={setMembers.slice(0, NUMBER_OF_ITEMS_TO_DISPLAY).join(' ')}
        remainingItems={setMembers.slice(NUMBER_OF_ITEMS_TO_DISPLAY).join(' ')}
      />;
    }
    if (answers && answers.length > 0) {
      remainingCount = answers.length - NUMBER_OF_ITEMS_TO_DISPLAY;
      return <CardBody
        remainingCount={remainingCount}
        title="Answers"
        body={answers.slice(0, NUMBER_OF_ITEMS_TO_DISPLAY).join(' ')}
        remainingItems={answers.slice(NUMBER_OF_ITEMS_TO_DISPLAY).join(' ')}
      />;
    }
    return '';
  };

  return (
    <div className="col-9">
      <Modal isOpen={open} className="modal-lg">
        <ModalBody className="preview-modal">
          <h6>
            {`${display_name}  (${id})`}
            <div className="card-version">
              <small>
                <a href={`${TRADITIONAL_OCL_HOST}${url}`} target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-external-link-alt" />
View in traditional OCL
                </a>
              </small>
            </div>
          </h6>
          <div className="header-divider" />
          <p className="synonyms">
            <small>
              <em className="float-right">{display_locale}</em>
            </small>
          </p>
          <CardBody title="Synonyms" body={synonyms} />
          <CardBody title="Description" body={description} />
          <div className="row preview-row">
            <div><CardBody title="Class" body={concept_class} /></div>
            <div><CardBody title="Data Type" body={datatype} /></div>
          </div>
          {displaySetMembersOrAnswers()}
          <MappingPreview title="Mappings" body={otherMappings.length > 0 ? otherMappings : 'none'} />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            id="addConcept"
            onClick={() => {
              addConcept(url, display_name);
              closeModal();
            }}
          >
            Add
          </Button>
          &nbsp;
          <Button color="secondary" id="previewModalCloseBtn" onClick={() => closeModal()}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

PreviewCard.propTypes = {
  closeModal: PropTypes.func.isRequired,
  addConcept: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  concept: PropTypes.shape({
    display_name: PropTypes.string,
    descriptions: PropTypes.array,
    mappings: PropTypes.any,
    display_locale: PropTypes.string,
    concept_class: PropTypes.string,
    datatype: PropTypes.string,
  }).isRequired,
};

export default PreviewCard;
