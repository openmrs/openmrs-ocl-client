import React from 'react';
import { mount } from 'enzyme';
import { StaticRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Navbar from '../components/Navbar';

const initialState = {
  users: {
    loggedIn: false,
  },
};

const mockStore = configureStore();
let store;
let wrapper;

beforeEach(() => {
  // creates the store with any initial state
  store = mockStore(initialState);
  wrapper = mount(<StaticRouter context={{}}>
    <Navbar store={store} />
  </StaticRouter>);
});
describe('Navbar Component', () => {
  it('should render without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders logout function', () => {
    expect(wrapper.find('LogoutAction')).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });
});
