import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import {createContainer} from 'meteor/react-meteor-data';

import LoginPage from './LoginPage/LoginPageContainer';
import IndexPageContainer from "./IndexPage/IndexPageContainer";
import AppPageContainer from "./AppPage/AppPageContainer";

import {connect} from 'react-redux';

import {Fragment} from 'redux-little-router';

class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        /*        let initialPage;
                if (this.props.isLoggedIn)
                    initialPage = <IndexPageContainer/>;
                else
                    initialPage = <LoginPage/>;
        */
        return (
            <Fragment forRoute='/'>
                <div>
                    <Fragment forRoute='/'><LoginPage/></Fragment>
                    <Fragment forRoute='/login'><LoginPage/></Fragment>
                    <Fragment forRoute='/IndexPage'><IndexPageContainer/></Fragment>
                    <Fragment forRoute='/AppPage'><AppPageContainer/></Fragment>
                </div>
            </Fragment>
        );
    }
}


const mapStateToProps = function (state) {

    return (
        {router: state.router},
        {isLoggedIn: state.RootReducer.userLoggedIn}
    );

};


export default connect(mapStateToProps)(HomePage);
