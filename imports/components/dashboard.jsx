import React, { Component } from 'react';
import { Dropdown, Grid, Form, Menu } from 'semantic-ui-react';
import CytoscapeCanvas from "./cytoscapejs/canvas";
import CytoscapeInfo from "./cytoscapejs/info";

import { push } from 'redux-little-router';

import { connect } from 'react-redux';
import  { draw } from '../redux/actions/actioncreators';


const stateOptions = [
    {
        key : 'rdf',
        value : 'application/rdf+xml',
        text : 'application/rdf+xml'
    },
    {
        key: 'ttl',
        value : 'text/turtle',
        text : 'text/turtle'
    }
];

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state={
            url : null,
            type : null
        };
        this.SetURI = this.SetURI.bind(this);
        this.Send = this.Send.bind(this);
        this.LogOut = this.LogOut.bind(this);
        this.SetType = this.SetType.bind(this);
    }

    componentDidMount(){
        let self=this;
        Meteor.call('count_triples',function (err,res) {
            console.log(res+" triples");
            if(res!==0){
                self.props.draw(true);
            }
        });
    }

    LogOut(event){
        event.preventDefault();
        self = this;
        Meteor.logout(function (err) {
            if(err)
                console.log(err);
            else {
                console.log("Successfully Logged Out");
                self.props.redirect('/');
            }
        });
    }

    SetURI(event){
        this.setState({url : event.target.value})
    }

    SetType(event,data){
        this.setState({type : data.value})
    }

    Send(){
        url = this.state.url;
        type = this.state.type;
        self = this;
        Meteor.call('parse_and_send_to_cayley',url,type ,function (err,res) {
            if(res){
                console.log(res);
                self.props.draw(true)
            }
        });
    }

    render() {
        if(this.props.canvas===true){
            return(
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={12}>
                            <CytoscapeCanvas/>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <CytoscapeInfo/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }
        else{
            return (
                <Grid columns={3} centered>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Menu>
                                <Menu.Item name='logout' position="right" onClick={this.LogOut} />
                            </Menu>
                        </Grid.Column>
                    </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={6}>
                        <Form onSubmit={this.Send}>
                            <Form.Field>
                                <Form.Input type="text" placeholder='Ontology URI' name='ontolgy_uri' onChange={this.SetURI} />
                                <Dropdown placeholder='Data Type' selection options={stateOptions} onChange={this.SetType}/><br/><br/>
                                <Form.Button type="submit"> Visualize the Ontology </Form.Button>
                            </Form.Field>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
            </Grid>);
        }
    }
}

const mapDispatchToProps = dispatch => {
   return{
       redirect : function(href){
            return dispatch(push(href))
       },
       draw : function (boole) {
           return dispatch(draw(boole))
       }
   };
};

const mapStateToProps = state => {
    return {
        canvas: state.RootReducer.draw
    }
};


export default connect(mapStateToProps,mapDispatchToProps)(Dashboard);


