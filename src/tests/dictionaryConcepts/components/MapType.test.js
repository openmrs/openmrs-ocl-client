import React from 'react';
import { shallow } from 'enzyme';
import MapType from '../../../components/dictionaryConcepts/components/MapType';

describe('<MapType />', () => {
  it('should render text area for map type when source is CIEL', () => {
    const props = {
      source: 'CIEL',
    };
    const wrapper = shallow(<MapType {...props} />);
    expect(wrapper.find('select')).toHaveLength(0);
    expect(wrapper.find('input')).toHaveLength(1);
  });

  it('should render select drop down for any other source', () => {
    const props = {
      source: 'test source',
    };
    const wrapper = shallow(<MapType {...props} />);
    expect(wrapper.find('select')).toHaveLength(1);
    expect(wrapper.find('input')).toHaveLength(0);
  });
});
