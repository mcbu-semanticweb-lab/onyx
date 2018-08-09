import { combineReducers } from 'redux'
import  { selectedNode,draw,canvasAnimations,userLoggedIn}  from './reducers'

const RootReducer = combineReducers({
     selectedNode,draw,canvasAnimations,userLoggedIn
});

export default RootReducer