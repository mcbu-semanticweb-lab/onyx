import React, { Component} from 'react';
import cytoscape from 'cytoscape';
import {DEF_VISUAL_STYLE} from '../../cytoscape/visual-style';
import OPTIONS from '../../cytoscape/colajs-options';
import { Random } from 'meteor/random';
import { Grid, Menu} from 'semantic-ui-react';
import Dashboard from "../dashboard";

import { connect } from 'react-redux';
import { select,draw }   from '../../redux/actions/actioncreators';

class CytoscapeRenderer extends Component {

    constructor(props){
        super(props);
        this.state = {
            cy : null,
            draw : true
        };
        this.Remove = this.Remove.bind(this);
        this.setnode = this.setnode.bind(this);
    }

    componentDidMount() {
        let self = this;
        let cy = cytoscape({
            container: document.getElementById('cy'),
            style: DEF_VISUAL_STYLE,
        });
        let cycola = require('cytoscape-cola');
        cycola( cytoscape );
        Meteor.call('get_domains_for_visualize',function (err,res) {
            res.forEach(function(triple){
                cy.add([
                    { group: "nodes", data: {id: triple.subject, label: triple.subject} },
                    { group: "nodes", data: { id: triple.object , label: triple.object} },
                    { group: "edges", data: { id: Random.id(), source: triple.subject, target: triple.object, group: "domain" }}
                ]);
            });
        });

        Meteor.call('get_ranges_for_visualize',function (err,res) {
            res.forEach(function(triple){
                cy.add([
                    { group: "nodes", data: { id: triple.subject , label : triple.subject}},
                    { group: "nodes", data: { id: triple.object , label: triple.object}},
                    { group: "edges", data: { id: Random.id(), source: triple.subject, target: triple.object, group: "range" } }
                ]);
            });
            self.setState({cy:cy})
        });
    }

    componentDidUpdate(){
        cy = this.state.cy;
        let layout = cy.layout(OPTIONS);
        layout.run();
        self = this;
        this.setnode();
    }

    setnode(){
        let self = this;
        cy.on('tap', 'node', function(event){
            self.props.select(event.target.id());
        });
    }

    Remove(){
        self = this;
        Meteor.call('remove_triples',function (err,res) {
            if(res){
                console.log(res);
                self.props.draw(false)
            }
        });
    }

    render() {
        if(this.props.canvas===true){
            return (<Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Menu>
                            <Menu.Item name='Remove Nodes and BackDashboard'  onClick={this.Remove} />
                        </Menu>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <div id="cy"/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>);
        }
        else
            return (<Dashboard/>);
    };
}

const mapDispatchToProps = dispatch => {
    return{
        select : function (id) {
            return(dispatch(select(id)));
        },
        draw : function (boole) {
            return(dispatch(draw(boole)))
        }
    }
};

const mapStateToProps = state => {
    return {
        canvas: state.RootReducer.draw
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(CytoscapeRenderer);


/*
cy.add([
                    { group: "nodes", data: {id: triple.subject, label: triple.subject} },
                    { group: "nodes", data: { id: triple.object , label: triple.object} },
                    { group: "edges", data: { id: Random.id(), source: triple.subject, target: triple.object, group: "domain" },
                        style: {
                            'width': '8',
                        }}
                ]);


                                cy.add([
                    { group: "nodes", data: { id: triple.subject , label : triple.subject},
                        style: {
                            'width': '150px',
                            'height': '150px'
                        }},
                    { group: "nodes", data: { id: triple.object , label: triple.object} ,
                        style: {
                            'width': '150px',
                            'height': '150px'
                        }},
                    { group: "edges", data: { id: Random.id(), source: triple.subject, target: triple.object, group: "range" } }
                ]);
 */

