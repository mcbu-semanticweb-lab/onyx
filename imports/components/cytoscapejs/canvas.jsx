import React, { Component} from 'react';
import cytoscape from 'cytoscape';
import {DEF_VISUAL_STYLE} from '../../cytoscape/visual-style';
import OPTIONS from '../../cytoscape/colajs-options';
import { Random } from 'meteor/random';
import { Grid} from 'semantic-ui-react';
import Dashboard from "../dashboard";

import { connect } from 'react-redux';
import {select, draw, showNeighborhood} from '../../redux/actions/actioncreators';

import { ontology_data } from '../../api/data';
import {showNeighborhoods, resetCanvas, showPitfalls, selectNode, unselectNode} from "../../cytoscape/functions";

class CytoscapeRenderer extends Component {

    constructor(props){
        super(props);
        this.state = {
            cy : null,
            draw : true
        };
        this.setnode = this.setnode.bind(this);
    }

    componentDidMount() {
        let self = this;
        let cy = cytoscape({
            container: document.getElementById('cy'),
            style: DEF_VISUAL_STYLE,
            minZoom: 0.3,
            maxZoom: 1.7,
            wheelSensitivity: 1,
        });
        let cycola = require('cytoscape-cola');
        cycola( cytoscape );

        cy.on('mouseover', 'node', function(event){
            event.target.addClass("hover");
        });


        cy.on('mouseout', 'node', function(event){
            event.target.removeClass("hover");
        });


        Meteor.call('get_triples_by_type',function (err,res) {
            res.forEach(function(triple){
                if(triple.object.slice(triple.object.lastIndexOf('/')+1).includes('Class')){
                    let size = ontology_data.findOne({ class_name : triple.subject}).instance_number;

                    cy.add([
                        { group: "nodes", data: { id: triple.subject , label : triple.subject.slice(triple.subject.lastIndexOf('/')+1).split('#').reverse()[0], group: "class"} ,  style: {
                                height: (size+1)*40,
                                width: (size+1)*40,
                            }},
                    ]);

                }

                else {

                    cy.add([
                        { group: "nodes", data: { id: triple.subject , label : triple.subject.slice(triple.subject.lastIndexOf('/')+1).split('#').reverse()[0], group: "other"  }},
                    ]);
                }

            });
        });

        Meteor.call('get_domains_for_visualize',function (err,res) {
            res.forEach(function(triple){
                if(triple.object.includes('#')){
                    cy.add([
                        { group: "nodes", data: {id: triple.object, label: triple.object.slice(triple.object.lastIndexOf('#')),group: "literal"}},
                        { group: "edges", data: { id: Random.id(), source: triple.subject, target: triple.object, group: "domain" }}
                    ]);
                }
                else{
                cy.add([
                    { group: "edges", data: { id: Random.id(), source: triple.subject, target: triple.object, group: "domain" }}
                ]);
                }
            });
        });

        Meteor.call('get_ranges_for_visualize',function (err,res) {
            res.forEach(function(triple){
                if(triple.object.includes('#')){
                    cy.add([
                        { group: "nodes", data: {id: triple.object, label: triple.object.slice(triple.object.lastIndexOf('#')),group: "literal"}},
                        { group: "edges", data: { id: Random.id(), source: triple.subject, target: triple.object, group: "range" } }
                    ]);
                    }
                else{
                cy.add([
                    { group: "edges", data: { id: Random.id(), source: triple.subject, target: triple.object, group: "range" } }
                ]);
                }
            });
            self.setState({cy:cy})
        });

    }  //TODO: ekleme işlemi dışarıda yapılabilir

    componentDidUpdate(prevProps,prevState){
        if(prevState.cy===null){
            cy = this.state.cy;
            let layout = cy.layout(OPTIONS);
            layout.run();
        }
        this.setnode();
    }

    componentWillReceiveProps(nextProps){
        cy = this.state.cy;
        if(this.props.selectedNode!==nextProps.selectedNode){
            unselectNode(cy,this.props.selectedNode);
            selectNode(cy,nextProps.selectedNode);
        }
        if(this.props.canvasAnimation.type===nextProps.canvasAnimation.type){
            console.log("states are equal");
        }
        else if(nextProps.canvasAnimation.type==="ResetCanvas") //reset sonrası select
            resetCanvas(cy);
        //else if(this.props.canvasAnimation.animation&&nextProps.canvasAnimation.animation)
          //  resetCanvas(cy);
        else if(nextProps.canvasAnimation.type==="ShowPitfalls")
            showPitfalls(cy,nextProps.pitfall_affected_elements);
        else if(nextProps.canvasAnimation.type==="ShowNeighborhood")
            showNeighborhoods(nextProps.selectedNode,cy);


    }

    setnode(){
        let self = this;
        cy.on('tap', 'node', function(event){
            self.props.select(event.target.id());
        });
    }



    render() {
        if(this.props.canvas===true){
            return (<Grid>
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
        },
        showNeighborhoods: function (boole) {
            return dispatch(showNeighborhood(boole))
        }
    }
};

const mapStateToProps = state => {
    return {
        canvas: state.RootReducer.draw,
        selectedNode : state.RootReducer.selectedNode,
        canvasAnimation : state.RootReducer.canvasAnimations,
        pitfall_affected_elements : state.RootReducer.canvasAnimations.affected_elements
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(CytoscapeRenderer);
