import React from 'react';
import { shallow } from 'enzyme';
import NumericPrecision from '../../../components/dictionaryConcepts/components/NumericPrecision';

let props;

describe('NumericPrecision', () => {
  beforeEach(() => {
    props = {
        numericPrecisionOptions:{
            numericEnabled: false,
            hiAbsolute:'',
            hiCritical:'',
            hiNormal:'',
            lowNormal:'',
            lowCritical:'',
            lowAbsolute:'',
            units:'',
            allowDecimal: false,
        },
       handleChange: jest.fn(),

    };
  });

  it('renders without crashing', () => {
    const numericPrecision = shallow(<NumericPrecision {...props} />);
    const wrapper = numericPrecision.find('.wrapper');
    expect(wrapper.length).toBe(1);
    
  });

});
