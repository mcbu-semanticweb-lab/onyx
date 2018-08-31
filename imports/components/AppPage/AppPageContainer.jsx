import React, {Component} from 'react';
import {Grid, Menu,Sidebar, Icon} from 'semantic-ui-react';
import CytoscapeCanvas from "./Canvas";
import CytoscapeInfo from "./Info";
import Navbar from "./Navbar";


export default class AppPageContainer extends Component{

    constructor(props){
        super(props);
        this.state = {
            sidebar_visible:false,
        };

        this.toggleVisibility = this.toggleVisibility.bind(this);
    }

    componentDidMount(){
        Meteor.call('get_individual_num', function (err, res) {
            if (res)
                console.log(res);
            else
                console.log(err);
        });
    }


    toggleVisibility(){
        this.setState({ sidebar_visible: !this.state.sidebar_visible});
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
                        visible={this.state.sidebar_visible}
                        vertical
                    >
                        <Icon bordered link name='remove' size='big' className='sidebar-icon' onClick={this.toggleVisibility}/><br/><br/><br/><br/><br/>
                        <CytoscapeInfo/>
                    </Sidebar>
                </Grid.Row>
            </Grid>
        )
    }
}