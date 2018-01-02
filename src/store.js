import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
// import {LOADING, SUCCESS, FAILURE} from './pages/Home/status';
// import util from './util/util';
import weatherReducer from './pages/Device/reducer';

const DeviceInfo = {
    weather: {
        header: {
            title: [{
                content: '反馈'
            }]
        }
    },
};
const reducer = combineReducers({
    weather: weatherReducer
  });
const middlewares = [thunkMiddleware];

export default createStore(reducer, DeviceInfo, applyMiddleware(...middlewares));