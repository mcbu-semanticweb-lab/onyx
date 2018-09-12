import React, {Component} from 'react';
import {Menu, Sidebar, Icon, Tab} from 'semantic-ui-react';
import CytoscapeInfo from "./CanvasInfo";
import {showsidebar} from "../../redux/actions/actioncreators";
import {connect} from "react-redux";
import CanvasProperties from "./CanvasProperties";
import CanvasFunctions from "./CanvasFunctions";


class mySidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sidebar_visible: false,
        };
    }


    render() {
        const panes = [
            {menuItem: 'Tab 1', render: () => <Tab.Pane attached={false}><CytoscapeInfo/></Tab.Pane>},
            {menuItem: 'Tab 2', render: () => <Tab.Pane attached={false}> <CanvasProperties/> </Tab.Pane>},
            {menuItem: 'Tab 3', render: () => <Tab.Pane attached={false}> <CanvasFunctions/> </Tab.Pane>}
        ];


        return (
            <div>
                <Sidebar
                    as={Menu}
                    animation='overlay'
                    width='wide'
                    direction='right'
                    visible={this.props.canvasProperties.sidebar}
                    vertical
                >
                    <Tab menu={{secondary: true, pointing: true}} panes={panes}/>
                    <Icon bordered link name='remove' size='big' className='sidebar-icon'
                          onClick={this.props.showSidebar}/><br/><br/><br/><br/><br/>
                </Sidebar>
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
        showSidebar: function () {
            return dispatch(showsidebar())
        },

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(mySidebar);
