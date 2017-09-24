import React, { Component} from 'react';
import { connect } from 'react-redux';

import '../styles/info.css';

import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import ActionInfo from 'material-ui/svg-icons/action/info';

class NodeInfo extends Component {

    constructor(props){
        super(props);
        this.state={data:null}
    }

    componentWillReceiveProps(nextProps){
        let self = this;
        Meteor.call('attributes',nextProps.id ,(error, result) => {
            self.setState({data:result})
        });
    }

    render() {
        return (<Paper id="info" zDepth={1}>
                <List>
                <ListItem>{this.props.id}</ListItem>
                </List>
            {Array.isArray(this.state.data) && this.state.data.map((data) => {
                return <div key={data._id}>
                    <List>
                        <ListItem
                            primaryText={data.predicate}
                            leftIcon={<ActionInfo />}
                            initiallyOpen={false}
                            primaryTogglesNestedList={true}
                            nestedItems={[
                                <ListItem
                                    key = {data._id}
                                    primaryText={data.object}
                                />,
                            ]}
                        />
                    </List>
                </div>
            })}</Paper>
        )
    }
}

function mapStateToProps(state){
    return {id : state};
}


export default connect(mapStateToProps)(NodeInfo);