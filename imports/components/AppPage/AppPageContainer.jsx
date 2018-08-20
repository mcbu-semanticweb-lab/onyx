import React, {Component} from 'react';
import {Grid, Form, Menu,Sidebar, Search, Icon} from 'semantic-ui-react';
import CytoscapeCanvas from "./Canvas";
import CytoscapeInfo from "./Info";
import Pitfall from "./Pitfall";
import {connect} from "react-redux";
import {
    draw,
    pitfall,
    resetCanvas,
    search,
    showNeighborhood,
    showrestriction,
    undo
} from "../../redux/actions/actioncreators";
import {push} from "redux-little-router";


class AppPageContainer extends Component{

    constructor(props){
        super(props);
        this.state = {
            sidebar_visible:false,
        };

        this.toggleVisibility = this.toggleVisibility.bind(this);
        this.Remove= this.Remove.bind(this);
        this.ShowNeighborhood= this.ShowNeighborhood.bind(this);
        this.ResetCanvas= this.ResetCanvas.bind(this);
        this.ShowRestriction= this.ShowRestriction.bind(this);
        this.searchSubmit= this.searchSubmit.bind(this);
        this.Undo= this.Undo.bind(this);


    }

    componentDidMount(){
        Meteor.call('get_individual_num', function (err, res) {
            if (res)
                console.log(res);
            else
                console.log(err);
        });
    }



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

    toggleVisibility(){
        this.setState({ sidebar_visible: !this.state.sidebar_visible});
    }

    Undo(){
        this.props.undo(true);
    }


    render(){
        return (
            <Grid>
                <Grid.Row>
                    <Menu attached='top'>
                        <Menu.Item name='Remove Nodes and BackDashboard'  position='left' onClick={this.Remove} />
                        <Menu.Item name='Show Neighborhood'  position='left' onClick={this.ShowNeighborhood} />
                        <Menu.Item name='Reset Canvas'  position='left' onClick={this.ResetCanvas} />
                        <Menu.Item name='Show Restriction'  position='left' onClick={this.ShowRestriction} />
                        <Menu.Item name='Undo'  position='left' onClick={this.Undo} />
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
                        <Pitfall/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>


        )
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
        },
        undo: function (eles) {
            return dispatch(undo(eles))
        }
    };
};


export default connect(null, mapDispatchToProps)(AppPageContainer);