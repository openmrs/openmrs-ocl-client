import {
  compareConceptsByUpdateDate,
  KEY_CODE_FOR_ENTER,
  KEY_CODE_FOR_SPACE,
  preventFormSubmit
} from '../../../components/dictionaryConcepts/components/helperFunction';

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
