import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base'
import {Button, Form} from 'semantic-ui-react';
import React, {Component} from 'react';
import {Tab, Grid} from 'semantic-ui-react';

import {connect} from 'react-redux';

import {push} from 'redux-little-router';
import { isLoggedIn } from '../../redux/actions/actioncreators';


class LoginPageContainer extends Component {

    self = this;

    constructor(props) {
        super(props);
        this.state = {
            email: null,
            pass: null
        };
        this.SetEmail = this.SetEmail.bind(this);
        this.SetPass = this.SetPass.bind(this);
        this.SetPass = this.SetPass.bind(this);
        this.Login = this.Login.bind(this);
        this.Register = this.Register.bind(this);
    }

    SetEmail(event) {
        this.setState({email: event.target.value});
    }

    SetPass(event) {
        this.setState({pass: event.target.value});
    }

    Register(event) {
        event.preventDefault();
        let email = this.state.email;
        let pass = this.state.pass;
        console.log(email, pass);
        Accounts.createUser({
            email: email,
            password: pass
        }, function (err) {
            if (err)
                console.log(err);
            else {
                console.log("Successfully Registered");
                self.props.redirect('/dashboard')
            }
        });
    }

    Login(event) {
        event.preventDefault();
        let email = this.state.email;
        let pass = this.state.pass;
        self = this;
        Meteor.loginWithPassword(email, pass, function (err) {
            if (err)
                console.log(err.message);
            else {
                console.log("Succesfully Logged In");
                self.props.redirect('/IndexPage');
                self.props.isLoggedIn(true);
            }
        });
    }


    render() {
        return (
            <Grid className="login-form" verticalAlign='middle' columns="3" centered>
                <Grid.Row>
                    <Grid.Column>
                        <Tab menu={{color: 'grey', attached: true}} panes={this.panes}/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }


    panes = [
        {
            menuItem: "Login", render: () => <Tab.Pane>
                <Form onSubmit={this.Login}>
                    <Form.Field>
                        <Form.Input type="email" placeholder='email' name='email' onChange={this.SetEmail}/>
                        <Form.Input type="password" placeholder='pass' name='pass' onChange={this.SetPass}/>
                        <Form.Button type="submit"> Login </Form.Button>
                    </Form.Field>
                </Form>
            </Tab.Pane>
        },
        {
            menuItem: "Register", render: () => <Tab.Pane>
                <Form onSubmit={this.Register}>
                    <Form.Field>
                        <Form.Input type="email" placeholder='email' name='email' onChange={this.SetEmail}/>
                        <Form.Input type="password" placeholder='pass' name='pass' onChange={this.SetPass}/>
                    </Form.Field>
                    <Button type="submit"> Register </Button>
                </Form>

            </Tab.Pane>
        },
    ];
}

const mapDispatchToProps = function (dispatch) {
    return {
        redirect: function (href) {
            return dispatch(push(href))
        },

        isLoggedIn: function (boole) {
            return dispatch(isLoggedIn(boole))
        }
    };
};


export default connect(null, mapDispatchToProps)(LoginPageContainer);

