import React, {Component} from 'react';
import {Grid, Menu,Sidebar, Icon} from 'semantic-ui-react';
import CytoscapeCanvas from "./Canvas";
import CytoscapeInfo from "./Info";
import Navbar from "./Navbar";
import { showsidebar } from "../../redux/actions/actioncreators";
import {connect} from "react-redux";


class AppPageContainer extends Component{

    constructor(props){
        super(props);
        this.state = {
            sidebar_visible:false,
        };
    }

    componentDidMount(){
        Meteor.call('get_individual_num', function (err, res) {
            if (res)
                console.log(res);
            else
                console.log(err);
        });
    }

    render(){
        return (
            <Grid>
                <Grid.Row>
                    <Navbar/>
                    <Grid.Column width={16}>
                        <CytoscapeCanvas/>
                    </Grid.Column>
                    <Sidebar
                        as={Menu}
                        animation='overlay'
                        width='wide'
                        direction='right'
                        visible={this.props.canvasProperties.sidebar}
                        vertical
                    >
                        <Icon bordered link name='remove' size='big' className='sidebar-icon' onClick={this.props.showSidebar}/><br/><br/><br/><br/><br/>
                        <CytoscapeInfo/>
                    </Sidebar>
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

export default connect(mapStateToProps,mapDispatchToProps)(AppPageContainer);
