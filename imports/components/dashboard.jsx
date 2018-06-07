import React, {Component} from 'react';
import {Grid, Form, Menu,Sidebar, Search} from 'semantic-ui-react';
import CytoscapeCanvas from "./cytoscapejs/canvas";
import CytoscapeInfo from "./cytoscapejs/info";

import {push} from 'redux-little-router';

import {connect} from 'react-redux';
import {draw,showNeighborhood,resetCanvas,pitfall,search,showrestriction} from '../redux/actions/actioncreators';

import {Button, Accordion, Icon} from 'semantic-ui-react';
import {Random} from 'meteor/random';

import response from '../api/oops-test-response'

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            url: null,
            pitfall_res: null,
            activeIndex: 0,
            affected_element: null,
            selectedNode: null,
            sidebar_visible:false,
        };
        this.SetURI = this.SetURI.bind(this);
        this.setAffectedElement = this.setAffectedElement.bind(this);
        this.Send = this.Send.bind(this);
        this.LogOut = this.LogOut.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
        this.Remove = this.Remove.bind(this);
        this.ShowNeighborhood = this.ShowNeighborhood.bind(this);
        this.ResetCanvas = this.ResetCanvas.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.ShowRestriction = this.ShowRestriction.bind(this);

    }

    componentDidMount() {
        let self = this;
        Meteor.call('count_triples', function (err, res) {
            console.log(res);
            if (res !== 0) {
                self.props.draw(true);
            }
        });


        Meteor.call('get_individual_num', function (err, res) {
            if (res)
                console.log(res);
            else
                console.log(err);
        });


        let x;
        Meteor.call('rdf_translator', null, response, function (err, res) {
            if (res) {
                x = JSON.parse(res);
                self.setState({pitfall_res: x["@graph"]});
                console.log(x["@graph"]);
            }
            else
                console.log(err);
        });
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

    SetURI(event) {
        this.setState({url: event.target.value})
    }

    setAffectedElement(event,data) {
        if(data)
            this.props.pitfall_set(data);
    }

    Send() {
        url = this.state.url;
        self = this;
        Meteor.call('parse_and_send_to_cayley', url, function (err, res) {
            if (res) {
                console.log(res);
                self.props.draw(true)
            }
        });

        Meteor.call('class_instance'); //callback yavaş kalabiliyor

        Meteor.call('class_number', function (err, res) {
            if (res)
                console.log('Class Number is  ' + res);
            else
                console.log(err);
        });
        Meteor.call('class_utilization', function (err, res) {
            if (res)
                console.log('Class Utilization  ' + res);
            else
                console.log(err);
        });
        Meteor.call('instance_number', function (err, res) {
            if (res)
                console.log('Total number of instances   ' + res);
            else
                console.log(err);
        });
        Meteor.call('property_number', function (err, res) {
            if (res)
                console.log('Total number of properties   ' + res);
            else
                console.log(err);
        });

        // Meteor.call('pitfall_scanner',url,function (err,res) {
        //     if(res){

        //     }
        // });


        //



    }

    handleClick = (e, titleProps) => {
        const {index} = titleProps;
        const {activeIndex} = this.state.activeIndex;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({activeIndex: newIndex})
    };


    toggleVisibility = () => this.setState({ sidebar_visible: !this.state.sidebar_visible});

    Remove(){
        self = this;
        Meteor.call('remove_triples',function (err,res) {
            if(res){
                console.log(res);
                self.props.draw(false)
            }
        });
    }

    ShowNeighborhood(){
        this.props.showNeighborhoods(true);
    }

    ResetCanvas(){
        this.props.resetCanvas(true);
    }

    ShowRestriction(){
        this.props.showrestriction(true);
    }


    searchSubmit(event){
        if(event.target.value.length!==0)
            this.props.search(event.target.value);
    }


    render() {
        let content;
        const activeIndex = this.state.activeIndex;
        console.log(this.state.pitfall_res);
        if (this.state.pitfall_res !== null && this.state.pitfall_res !== undefined) {
            content = this.state.pitfall_res.map((data, index) => {
                if(data["@type"]==="oops:pitfall"&&data["oops:hasAffectedElement"]&&data["oops:hasAffectedElement"].length!==undefined){
                   console.log(data);
                    return (
                        <Accordion styled fluid key={Random.id()} >
                            <Accordion.Title active={activeIndex === index} index={index} onClick={this.handleClick}>
                                <Icon name='dropdown'/>
                                {data["oops:hasName"]}
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === index}>
                                <p>
                                    {data["oops:hasDescription"]} <Button type={"submit"} onClick={(e) => this.setAffectedElement(e, data["oops:hasAffectedElement"])}> Show </Button>
                                </p>
                                <br/>
                                {
                                    data["oops:hasAffectedElement"].map((data,index) => {
                                        return (<div key={index}><br/>{data["@value"]}</div>);
                                })
                                }
                            </Accordion.Content>
                        </Accordion>);
                }
            })
        }
        if (this.props.canvas === true) {
            return (
                <Grid>
                    <Grid.Row>
                        <Menu attached='top'>
                            <Menu.Item name='Remove Nodes and BackDashboard'  position='left' onClick={this.Remove} />
                            <Menu.Item name='Show Neighborhood'  position='left' onClick={this.ShowNeighborhood} />
                            <Menu.Item name='Reset Canvas'  position='left' onClick={this.ResetCanvas} />
                            <Menu.Item name='Show Restriction'  position='left' onClick={this.ShowRestriction} />
                            <Search
                                onClick={this.searchSubmit}
                            />
                            <Menu.Item position='right' onClick={this.toggleVisibility}>
                                <Icon link name='angle left' size='big' />
                            </Menu.Item>
                        </Menu>
                        <Grid.Column width={16}>
                            <CytoscapeCanvas/>
                        </Grid.Column>
                        <Sidebar
                            as={Menu}
                            animation='overlay'
                            width='wide'
                            direction='right'
                            visible={this.state.sidebar_visible}
                            vertical
                        >
                            <Icon bordered link name='remove' size='big' className='sidebar-icon' onClick={this.toggleVisibility}/><br/><br/><br/><br/><br/>

                            <CytoscapeInfo/>
                        </Sidebar>
                        <Grid.Column width={16} className={'pitfall'}>
                            {content}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }
        else {
            return (
                <Grid columns={3} centered>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Menu>
                                <Menu.Item name='logout' position="right" onClick={this.LogOut}/>
                            </Menu>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={6}>
                            <Form onSubmit={this.Send}>
                                <Form.Field>
                                    <Form.Input type="text" placeholder='Ontology URI' name='ontolgy_uri'
                                                onChange={this.SetURI}/>
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
    return {
        redirect: function (href) {
            return dispatch(push(href))
        },
        draw: function (boole) {
            return dispatch(draw(boole))
        },
        showNeighborhoods: function (boole) {
            return dispatch(showNeighborhood(boole))
        },
        resetCanvas: function (boole) {
            return dispatch(resetCanvas(boole))
        },
        pitfall_set: function (eles) {
            return dispatch(pitfall(eles))
        },
        search: function (label) {
            return dispatch(search(label))
        },
        showrestriction: function (eles) {
            return dispatch(showrestriction(eles))
        }
    };
};

const mapStateToProps = state => {
    return {
        canvas: state.RootReducer.draw,
        selectedNode: state.RootReducer.selectedNode
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);