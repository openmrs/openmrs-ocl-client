import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};

const uuid = { v4: jest.fn(() => 1) };
global.uuid = uuid;
global.localStorage = localStorageMock;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
