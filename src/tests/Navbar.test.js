import React from 'react';
import { mount, shallow } from 'enzyme';
import { StaticRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { NavbarToggler } from 'reactstrap';
import Navbar from '../components/Navbar';
import GeneralSearch from '../components/GeneralSearch/NavbarGeneralSearch';

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

  it('should toggle state isOpen value on button click', () => {
    const props = {
      loggedIn: true,
      history: { push: jest.fn() },
      logoutAction: jest.fn(),
    };
    wrapper = shallow(<Navbar.WrappedComponent store={store} {...props} />);
    const toggleBtn = wrapper.find(NavbarToggler);
    toggleBtn.simulate('click');
    expect(wrapper.state().isOpen).toBe(true);
  });
});

describe('Toggle function', () => {
  it('should toggle the dropdown', () => {
    const props = {
      loggedIn: true,
      history: { push: jest.fn() },
      logoutAction: jest.fn(),
    };
    wrapper = shallow(<Navbar.WrappedComponent store={store} {...props} />);
    const instance = wrapper.instance();
    expect(wrapper.state().isOpen).toBe(false);
    instance.toggle();
    expect(wrapper.state().isOpen).toBe(true);
  });
});

describe('GeneralSearch', () => {
  const props = {
    onSearch: jest.fn(),
    onSubmit: jest.fn(),
    searchValue: '',
  };
  it('should render the GeneralSearch', () => {
    const component = mount(<GeneralSearch {...props} />);
    expect(component).toMatchSnapshot();
  });
});
