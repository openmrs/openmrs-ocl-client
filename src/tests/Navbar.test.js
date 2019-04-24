import React from 'react';
import { mount, shallow } from 'enzyme';
import { StaticRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { NavbarToggler } from 'reactstrap';
import thunk from 'redux-thunk';
import { notify } from 'react-notify-toast';
import Navbar from '../components/Navbar';
import GeneralSearch from '../components/GeneralSearch/NavbarGeneralSearch';

const initialState = {
  users: {
    loggedIn: false,
  },
};

const mockStore = configureStore([thunk]);
let store;
let wrapper;

describe('Navbar Component', () => {
  beforeAll(() => {
    jest.mock('react-notify-toast');
    notify.show = jest.fn();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should render without crashing', () => {
    const props = {
      loggedIn: false,
      user: {
        username: '',
      },
      logoutAction: jest.fn(),
      history: {
        url: '',
        push: jest.fn(),
      },
    };
    store = mockStore(initialState);
    wrapper = mount(<StaticRouter context={{}}>
      <Navbar store={store} {...props} />
    </StaticRouter>);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders logout function', () => {
    const props = {
      loggedIn: true,
      user: {
        username: '',
      },
      logoutAction: jest.fn(),
      history: {
        url: '',
        push: jest.fn(),
      },
    };

    const updatedState = {
      users: {
        loggedIn: true,
      },
    };
    store = mockStore(updatedState);
    wrapper = mount(<StaticRouter context={{}}>
      <Navbar store={store} {...props} />
    </StaticRouter>);

    expect(wrapper.length).toEqual(1);

    const event = {
      preventDefault: () => {},
    };
    wrapper.find('#logout-user').at(0).simulate('click', event);
    expect(notify.show).toHaveBeenCalledWith('You Logged out successfully', 'success', 3000);
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
