import { combineReducers } from 'redux'
import  { selectedNode,draw,canvasAnimations }  from './reducers'

const RootReducer = combineReducers({
     selectedNode,draw,canvasAnimations
});

export default RootReducer