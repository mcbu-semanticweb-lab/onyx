import { combineReducers } from 'redux'
import  { selectedNode,draw,canvasAnimations,userLoggedIn,canvasProperties}  from './reducers'

const RootReducer = combineReducers({
     selectedNode,draw,canvasAnimations,userLoggedIn,canvasProperties
});

export default RootReducer