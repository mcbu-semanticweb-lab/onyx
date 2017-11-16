import { combineReducers } from 'redux'
import  { select,draw }  from './reducers'

const RootReducer = combineReducers({
     select,draw
});

export default RootReducer