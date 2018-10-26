import React, {Component} from 'react';
import {Grid, Menu, Sidebar, Icon, Tab} from 'semantic-ui-react';
import CytoscapeCanvas from "./Canvas";
import Navbar from "./CanvasFunctions";
import { showSidebar } from "../../redux/actions/actioncreators";
import {connect} from "react-redux";
import SidebarComp from './mySidebar';


class AppPageContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sidebar_visible: false,
        };
    }

    componentDidMount() {
        Meteor.call('get_individual_num', function (err, res) {
            if (res)
                console.log(res);
            else
                console.log(err);
        });
    }

    render() {

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column floated='right' width={16}>
                        <Icon size='huge' name='bars' className="sidebar-icon" onClick={this.props.showSidebar}/>
                        <CytoscapeCanvas/>
                        <SidebarComp/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
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
            return dispatch(showSidebar())
        },

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppPageContainer);
