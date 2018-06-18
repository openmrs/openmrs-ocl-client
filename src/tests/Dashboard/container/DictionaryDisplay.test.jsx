import React from 'react';
import { mount, shallow } from 'enzyme';
import { DictionaryDisplay, mapStateToProps } from '../../../components/dashboard/container/DictionariesDisplay';
import dictionaries from '../../__mocks__/dictionaries';
import { Router,MemoryRouter,BrowserRouter } from 'react-router-dom';

jest.mock('../../../components/dashboard/components/dictionary/AddDictionary');
describe('DictionaryDisplay', () => {
    it('should render without any dictionary data', () => {
        const props = {
            fetchDictionaries: jest.fn(),
            dictionaries: [],
            isFetching: false,
        };
        const wrapper = <MemoryRouter><DictionaryDisplay {...props} /></MemoryRouter>;
        const rShallow = shallow(wrapper)
        expect(rShallow).toMatchSnapshot();
    });
    it('should render with dictionary data', () => {
        const props = {
            fetchDictionaries: jest.fn(),
            dictionaries: [dictionaries],
            isFetching: true,
        };
        const wrapper = mount(<MemoryRouter><DictionaryDisplay {...props} /></MemoryRouter>);

        expect(wrapper.find('.dashboard-wrapper')).toHaveLength(1)
        expect(wrapper).toMatchSnapshot();
    });
    it('should render preloader spinner', () => {
        const props = {
            fetchDictionaries: jest.fn(),
            dictionaries: [],
            isFetching: true,
        };
        const wrapper = shallow(<MemoryRouter><DictionaryDisplay {...props} /></MemoryRouter>);

        expect(wrapper).toMatchSnapshot();
    });
    it('should test mapStateToProps', () => {
        const initialState = {
            dictionaries: { dictionaries: [], loading: false },
        };
        expect(mapStateToProps(initialState).dictionaries).toEqual([]);
        expect(mapStateToProps(initialState).isFetching).toEqual(false);
    });
});
