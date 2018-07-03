import React from 'react';
import { mount, shallow } from 'enzyme';
import { DictionaryOverview, mapStateToProps }from '../../components/dashboard/components/dictionary/DictionaryContainer';
import dictionary from '../__mocks__/dictionaries';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/dashboard/components/dictionary/AddDictionary');
describe('DictionaryOverview', () => {
  it('should render without any data', () => {
    const props = {
      dictionary: [],
    };
    const wrapper = <MemoryRouter><DictionaryOverview {...props} /></MemoryRouter>
    expect(wrapper).toMatchSnapshot();
  });
  it('should render with dictionary data', () => {
    const props ={ 
    dictionary: [dictionary],
  };
  const wrapper = mount(<MemoryRouter><DictionaryOverview {...props} /></MemoryRouter>)
  expect(wrapper).toMatchSnapshot();
  });
});
