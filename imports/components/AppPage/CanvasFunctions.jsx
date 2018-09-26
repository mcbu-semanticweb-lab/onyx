import React, {Component} from 'react';
import {Menu, Icon, Dropdown, Checkbox, Button} from 'semantic-ui-react'
import Pitfall from "./Pitfall";
import {
    draw,
    resetCanvas,
    search,
    showNeighborhood,
    showrestriction,
    undo,
    shownavigator,
    showsidebar,
    redo,
    popup,
    hide,
    filter
} from "../../redux/actions/actioncreators";
import {connect} from "react-redux";
import SearchBar from './Search';

export class CanvasFunctions extends Component {

    constructor(props) {
        super(props);
        this.Remove = this.Remove.bind(this);
        this.ShowNeighborhood = this.ShowNeighborhood.bind(this);
        this.ResetCanvas = this.ResetCanvas.bind(this);
        this.ShowRestriction = this.ShowRestriction.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
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


    render() {
        return (
            <Menu size="huge" vertical secondary>
                <SearchBar/>
                <br/><br/>
                <Button.Group vertical labeled icon>
                    <Button icon='sitemap' content='Show Neighborhood' onClick={this.ShowNeighborhood}/>
                    <br/>
                    <Button icon='refresh' content='Reset Canvas' onClick={this.ResetCanvas}/>
                    <br/>
                    <Button icon='registered outline' content='Show Restriction' onClick={this.ShowRestriction} />
                    <br/>
                    <Button icon='undo' content='Undo'onClick={this.props.undo} />
                    <br/>
                    <Button icon='repeat' content='Redo' onClick={this.props.redo} />
                </Button.Group>
                <br/><br/>
                <Checkbox slider name='Filter-Subclass' label='Filter-Subclass' position='left' onClick={(e,data) => this.props.filter("subclass",data.checked)}/>
                <br/><br/>
                <Pitfall/>
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
        undo: function () {
            return dispatch(undo())
        },
        redo: function () {
            return dispatch(redo())
        },
        showNavigator: function () {
            return dispatch(shownavigator())
        },
        pop_up: function () {
            return dispatch(popup())
        },
        hide: function () {
            return dispatch(hide())
        },
        filter: function (filter_type,checked) {
            return dispatch(filter(filter_type,checked))
        },
    };
};


export default connect(null, mapDispatchToProps)(CanvasFunctions);