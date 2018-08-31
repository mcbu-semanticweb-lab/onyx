import React, {Component} from 'react';
import { Menu,Search,Icon,Transition } from 'semantic-ui-react'
import Pitfall from "./Pitfall";
import {
    draw,
    resetCanvas,
    search,
    showNeighborhood,
    showrestriction,
    undo,
    shownavigator, showsidebar
} from "../../redux/actions/actioncreators";
import {connect} from "react-redux";


export class Navbar extends Component {

    constructor(props) {
        super(props);

        this.Remove = this.Remove.bind(this);
        this.ShowNeighborhood = this.ShowNeighborhood.bind(this);
        this.ResetCanvas = this.ResetCanvas.bind(this);
        this.ShowRestriction = this.ShowRestriction.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.Undo = this.Undo.bind(this);
    }


    Remove() {
        self = this;
        Meteor.call('remove_triples', function (err, res) {
            if (res) {
                console.log(res);
                self.props.draw(false)
            }
        });
    }

    ShowNeighborhood() {
        this.props.showNeighborhoods(true);
    }

    ResetCanvas() {
        this.props.resetCanvas(true);
    }

    ShowRestriction() {
        this.props.showrestriction(true);
    }


    searchSubmit(event) {
        if (event.target.value.length !== 0)
            this.props.search(event.target.value);
    }

    Undo() {
        this.props.undo(true);
    }


    render() {
        return (
            <Menu attached='top' size="small" className="navbar2">
                <Menu.Item name='Remove Nodes and BackDashboard' position='left' onClick={this.Remove}/>
                <Menu.Item name='Show Neighborhood' position='left' onClick={this.ShowNeighborhood}/>
                <Menu.Item name='Reset Canvas' position='left' onClick={this.ResetCanvas}/>
                <Menu.Item name='Show Restriction' position='left' onClick={this.ShowRestriction}/>
                <Menu.Item name='Undo' position='left' onClick={this.Undo}/>
                <Menu.Item name='Pitfall' position='left'> <Pitfall/> </Menu.Item>
                <Menu.Item name='Navigator' position='left' onClick={this.props.showNavigator}/>
                <Search
                    onClick={this.searchSubmit}
                />
                <Menu.Item position='right' onClick={this.props.showSidebar}>
                    <Icon link name='angle left' size='big'/>
                </Menu.Item>
            </Menu>
        );
    }


}


const mapDispatchToProps = dispatch => {
    return {
        draw: function (boole) {
            return dispatch(draw(boole))
        },
        showNeighborhoods: function (boole) {
            return dispatch(showNeighborhood(boole))
        },
        resetCanvas: function (boole) {
            return dispatch(resetCanvas(boole))
        },
        search: function (label) {
            return dispatch(search(label))
        },
        showrestriction: function (eles) {
            return dispatch(showrestriction(eles))
        },
        undo: function (eles) {
            return dispatch(undo(eles))
        },
        showNavigator: function () {
            return dispatch(shownavigator())
        },
        showSidebar: function () {
            return dispatch(showsidebar())
        },

    };
};


export default connect( null,mapDispatchToProps)(Navbar);