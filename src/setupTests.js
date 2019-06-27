import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: key => delete store[key],
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const uuid = { v4: jest.fn(() => 1) };
global.uuid = uuid;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
global.XMLHttpRequest = undefined;
localStorage.setItem('token', 'Token mytoken');
localStorage.setItem('username', 'Dann');
