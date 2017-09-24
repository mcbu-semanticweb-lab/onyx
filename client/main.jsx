import { Meteor } from 'meteor/meteor';
import React from 'react';
import  ReactDOM  from 'react-dom';
import {createStore} from "redux";
import AllReducers from '../imports/reducers/Selected_Id_Reducer';
import { Provider } from 'react-redux';
import App from '../imports/ui/App';


export const store = createStore(AllReducers,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

Meteor.startup(() => {
    ReactDOM.render((<Provider store={store}><App /></Provider>),document.getElementById('render-target'));
});
