import React, {Component} from 'react';
import {Grid,  Menu,} from 'semantic-ui-react';


import {push} from 'redux-little-router';

import {connect} from 'react-redux';
import {Random} from 'meteor/random';

import AppPageContainer from "../AppPage/AppPageContainer";
import UriUpload from "./UriUpload";
import FileUpload from "./FileUpload";


class IndexPageContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            url: null,
            pitfall_res: null,
            activeIndex: 0,
            affected_element: null,
            selectedNode: null,
            loading: false,
        };
        this.LogOut = this.LogOut.bind(this);
    }


    LogOut(event) {
        event.preventDefault();
        self = this;
        Meteor.logout(function (err) {
            if (err)
                console.log(err);
            else {
                console.log("Successfully Logged Out");
                self.props.redirect('/');
            }
        });
    }


    render() {
        return (
            <Grid columns={3} centered>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Menu>
                            <Menu.Item name='logout' position="right" onClick={this.LogOut}/>
                        </Menu>
                    </Grid.Column>
                </Grid.Row>
                <UriUpload/>
                <FileUpload/>
            </Grid>);
    }
}

const mapDispatchToProps = dispatch => {
    return {
        redirect: function (href) {
            return dispatch(push(href))
        },
    };
};

const mapStateToProps = state => {
    return {
        canvas: state.RootReducer.draw,
        selectedNode: state.RootReducer.selectedNode
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(IndexPageContainer);