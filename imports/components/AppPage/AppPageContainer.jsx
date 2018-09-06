import React, {Component} from 'react';
import {Grid, Menu, Sidebar, Icon, Tab} from 'semantic-ui-react';
import CytoscapeCanvas from "./Canvas";
import Navbar from "./Navbar";
import {showsidebar} from "../../redux/actions/actioncreators";
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
                    <Navbar/>
                    <Grid.Column width={16}>
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
            return dispatch(showsidebar())
        },

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppPageContainer);
