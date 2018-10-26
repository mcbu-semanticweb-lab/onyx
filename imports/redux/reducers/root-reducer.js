import { combineReducers } from 'redux'
import {
    selectedNode,
    draw,
    canvasAnimations,
    userLoggedIn,
    canvasProperties,
    History,
    SearchReducer,
    ontologyInfo
} from './reducers'

const RootReducer = combineReducers({
     selectedNode,canvasAnimations,userLoggedIn,canvasProperties,History,SearchReducer,ontologyInfo
});

export default RootReducer