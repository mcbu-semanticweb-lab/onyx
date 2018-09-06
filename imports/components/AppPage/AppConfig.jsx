import React, {Component} from 'react';
import {Menu, Sidebar, Icon, Tab} from 'semantic-ui-react';
import {
    draw, filter, hide, popup, redo,
    resetCanvas,
    search, shownavigator,
    showNeighborhood,
    showrestriction,
    showsidebar, undo
} from "../../redux/actions/actioncreators";
import {connect} from "react-redux";
import {Checkbox} from 'semantic-ui-react'


class AppConfig extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sidebar_visible: false,
        };
    }


    render() {

        return (
            <div>
                <Checkbox slider name='Navigator' label='Navigator' position='left' onClick={this.props.showNavigator}/>
                <br/>
                <Checkbox slider name='Pop-up' label='Pop-up' position='left' onClick={this.props.pop_up}/>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        canvasProperties: state.RootReducer.canvasProperties,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        showNavigator: function () {
            return dispatch(shownavigator())
        },
        showSidebar: function () {
            return dispatch(showsidebar())
        },
        pop_up: function () {
            return dispatch(popup())
        },

    };
};


export default connect(mapStateToProps, mapDispatchToProps)(AppConfig);
