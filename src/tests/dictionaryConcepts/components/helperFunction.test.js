import {
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
