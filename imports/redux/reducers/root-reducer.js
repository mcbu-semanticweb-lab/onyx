import { combineReducers } from 'redux'
import  { selectedNode,draw,canvasAnimations,userLoggedIn,canvasProperties,History,SearchReducer}  from './reducers'

const RootReducer = combineReducers({
     selectedNode,draw,canvasAnimations,userLoggedIn,canvasProperties,History,SearchReducer
});

export default RootReducer