import {
  compareConceptsByUpdateDate,
  convertToFrontendNameType,
  buildAddConceptToCollectionMessage,
  KEY_CODE_FOR_ENTER,
  KEY_CODE_FOR_SPACE,
  preventFormSubmit, removeBlankMappings, removeBlankSetsOrAnswers,
} from '../../../components/dictionaryConcepts/components/helperFunction';
import { answer } from '../../__mocks__/answers';

describe('preventFormSubmit', () => {
  it('should return false when target is textarea', () => {
    expect(preventFormSubmit({ target: { type: 'textarea' } })).toBeFalsy();
  });

  it('should return false when which is not enter', () => {
    expect(preventFormSubmit({ target: { type: 'input' }, which: KEY_CODE_FOR_SPACE })).toBeFalsy();
  });

  it('should call preventDefault if enter is clicked', () => {
    const event = {
      target:
        {
          type: 'input',
        },
      which: KEY_CODE_FOR_ENTER,
      preventDefault: jest.fn(),
    };

    expect(event.preventDefault).not.toHaveBeenCalled();
    preventFormSubmit(event);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
  });
});

describe('compareConceptsByUpdateDate', () => {
  const olderConcept = {
    updated_on: 1,
  };
  const newerConcept = {
    updated_on: 2,
  };

  it('should return 1 if the first concept was updated before the second', () => {
    expect(compareConceptsByUpdateDate(olderConcept, newerConcept)).toEqual(1);
  });

  it('should return -1 if the second concept was updated before the first', () => {
    expect(compareConceptsByUpdateDate(newerConcept, olderConcept)).toEqual(-1);
  });

  it('should return 0 if the concepts have the same update time', () => {
    expect(compareConceptsByUpdateDate(olderConcept, olderConcept)).toEqual(0);
  });
});

describe('removeBlankMappings', () => {
  it('should return an empty list when there are no mappings', () => {
    expect(removeBlankMappings(null)).toEqual([]);
  });
});

describe('removeBlankSetsOrAnswers', () => {
  it('should remove blank mappings', () => {
    const data = [
      answer,
      { ...answer, url: '' },
    ];

    const expectedResult = [
      answer,
    ];

    expect(removeBlankSetsOrAnswers(data)).toEqual(expectedResult);
  });

  it('should return an empty list when there are no mappings', () => {
    expect(removeBlankSetsOrAnswers(null)).toEqual([]);
  });
});

describe('convertToFrontendNameType', () => {
  it('should convert the name to the expected frontend types', () => {
    expect(convertToFrontendNameType('FULLY_SPECIFIED')).toEqual('Fully Specified');
    expect(convertToFrontendNameType('SHORT')).toEqual('Short');
    expect(convertToFrontendNameType('INDEX_TERM')).toEqual('Index Term');
    expect(convertToFrontendNameType(null)).toEqual('Synonym');
  });

  it('should return the same name if a match is not found', () => {
    expect(convertToFrontendNameType('Not Known')).toEqual('Not Known');
  });
});

describe('buildAddConceptToCollectionMessage', () => {
  const conceptName = 'testConceptName';

  it('should build the right message for whether or not a concept was added', () => {
    expect(buildAddConceptToCollectionMessage(conceptName, [{ added: true }])).toEqual(`Added ${conceptName}.`);
    expect(buildAddConceptToCollectionMessage(conceptName, [{ added: false }])).toEqual(`${conceptName} already in collection.`);
  });

  it('should return a message with the right count for added and already added concepts', () => {
    const results = [
      { added: true },
      { added: false },
      { added: true },
    ];

    expect(buildAddConceptToCollectionMessage(conceptName, results)).toEqual(
      `Added ${conceptName}. 1 dependent concepts were added. 1 already added concepts were skipped`,
    );
  });

  it('should not include added concepts if there are none', () => {
    const results = [
      { added: true },
      { added: false },
    ];

    expect(buildAddConceptToCollectionMessage(conceptName, results)).toEqual(
      `Added ${conceptName}. 1 already added concepts were skipped`,
    );
  });

  it('should not include skipped concepts if there are none', () => {
    const results = [
      { added: true },
      { added: true },
    ];

    expect(buildAddConceptToCollectionMessage(conceptName, results)).toEqual(
      `Added ${conceptName}. 1 dependent concepts were added.`,
    );
  });
});
