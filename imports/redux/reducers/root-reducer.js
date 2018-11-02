import { combineReducers } from 'redux'
import {
    selectedNode,
    canvasAnimations,
    userLoggedIn,
    canvasProperties,
    History,
    SearchReducer,
    ontologyInfo, drawControl
} from './reducers'

const RootReducer = combineReducers({
     selectedNode,canvasAnimations,userLoggedIn,canvasProperties,History,SearchReducer,ontologyInfo,drawControl
});

export default RootReducer