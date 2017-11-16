import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import LoginPage from './login-page';
import Dashboard from "./dashboard";

import { connect } from 'react-redux';

import { Fragment } from 'redux-little-router';

class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <Fragment forRoute='/'>
                <div>
                    <Fragment forRoute='/'><LoginPage /></Fragment>
                    <Fragment forRoute='/login'><LoginPage /></Fragment>
                    <Fragment forRoute='/dashboard'><Dashboard /></Fragment>
                </div>
            </Fragment>
        );
    }
}


const mapStateToProps = state => ({ router: state.router });

export default connect(mapStateToProps)(HomePage);
