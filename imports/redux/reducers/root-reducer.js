import { combineReducers } from 'redux'
import  { selectedNode,draw,canvasAnimations,userLoggedIn,canvasProperties,History}  from './reducers'

const RootReducer = combineReducers({
     selectedNode,draw,canvasAnimations,userLoggedIn,canvasProperties,History
});

export default RootReducer