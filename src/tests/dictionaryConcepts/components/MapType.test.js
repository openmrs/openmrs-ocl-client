import React from 'react';
import { shallow } from 'enzyme';
import MapType from '../../../components/dictionaryConcepts/components/MapType';

describe('<MapType />', () => {
  it('should render select drop down', () => {
    const props = {
      map_type: 'test',
    };
    const wrapper = shallow(<MapType {...props} />);
    expect(wrapper.find('select')).toHaveLength(1);
  });
});
