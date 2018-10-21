import React, {Component} from 'react';
import {Menu, Icon, Dropdown, Checkbox, Button} from 'semantic-ui-react'
import Pitfall from "./Pitfall";
import {
    draw,
    resetCanvas,
    showNeighborhood,
    showRestriction,
    undo,
    shownavigator,
    redo,
    popup,
    hide,
    filter, showClassHierarchy
} from "../../redux/actions/actioncreators";
import {connect} from "react-redux";
import SearchBar from './Search';

export class CanvasFunctions extends Component {

    constructor(props) {
        super(props);
        this.Remove = this.Remove.bind(this);
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
                    <Button icon='sitemap' content='Show Neighborhood' onClick={this.props.showNeighborhoods}/>
                    <br/>
                    <Button icon='refresh' content='Reset Canvas' onClick={this.props.resetCanvas}/>
                    <br/>
                    <Button icon='registered outline' content='Show Restriction' onClick={this.props.showRestriction} />
                    <br/>
                    <Button icon='registered outline' content='Show Class Hierarchy' onClick={this.props.showClassHierarchy} />
                    <br/>
                    <Button icon='undo' content='Undo'onClick={this.props.undo} />
                    <br/>
                    <Button icon='repeat' content='Redo' onClick={this.props.redo} />
                </Button.Group>
                <br/><br/>
                <Checkbox slider name='Filter-Subclass' label='Filter-Subclass' position='left' onClick={(e,data) => this.props.filter('edge[group="subclass"]',data.checked)}/>
                <br/><br/>
                <Checkbox slider name='Filter-Restriction' label='Filter-restriction' position='left' onClick={(e,data) => this.props.filter('node[group="restriction"]',data.checked)}/>
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
        showNeighborhoods: function () {
            return dispatch(showNeighborhood())
        },
        resetCanvas: function () {
            return dispatch(resetCanvas())
        },
        search: function (label) {
            return dispatch(search(label))
        },
        showRestriction: function () {
            return dispatch(showRestriction())
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
        showClassHierarchy: function () {
            return dispatch(showClassHierarchy())
        },
    };
};


export default connect(null, mapDispatchToProps)(CanvasFunctions);