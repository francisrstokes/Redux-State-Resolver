import Adapter from 'enzyme-adapter-react-16';
import {configure} from 'enzyme';
import configureStore from 'redux-mock-store'

export default () => {
  configure({ adapter: new Adapter() });
  return {
    mockStore: configureStore()
  };
}
