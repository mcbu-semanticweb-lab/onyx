import React, {Component} from 'react';
import {
    popup,
    showNavigator,
    showSidebar
} from "../../redux/actions/actioncreators";
import {connect} from "react-redux";
import {Checkbox} from 'semantic-ui-react'


class CanvasProperties extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sidebar_visible: false,
        };
    }


    render() {
        // sağ tık onclick de sidebar açılabilir

        return (
            <div>
                <Checkbox slider checked={this.props.canvasProperties.navigator} name='Navigator' label='Navigator' position='left' onClick={this.props.showNavigator}/>
                <br/><br/>
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
            return dispatch(showNavigator())
        },
        showSidebar: function () {
            return dispatch(showSidebar())
        },
        pop_up: function () {
            return dispatch(popup())
        },

    };
};


export default connect(mapStateToProps, mapDispatchToProps)(CanvasProperties);
