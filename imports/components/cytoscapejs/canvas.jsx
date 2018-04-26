import React, { Component} from 'react';
import cytoscape from 'cytoscape';
import {DEF_VISUAL_STYLE} from '../../cytoscape/visual-style';
import { Random } from 'meteor/random';
import { Grid} from 'semantic-ui-react';
import Dashboard from "../dashboard";

import { connect } from 'react-redux';
import {select, draw, showNeighborhood} from '../../redux/actions/actioncreators';

import {
    showNeighborhoods,
    resetCanvas,
    showPitfalls,
    selectNode,
    unselectNode,
    search,
    add
} from "../../cytoscape/functions";

class CytoscapeRenderer extends Component {

    constructor(props){
        super(props);
        this.state = {
            cy : null,
            draw : true
        };
    }

    componentDidMount() {
        let self = this;
        let cy = cytoscape({
            container: document.getElementById('cy'),
            style: DEF_VISUAL_STYLE,
            minZoom: 0.1,
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

        cy.on('tap', 'node', function(event){
            self.props.select(event.target.id());
        });

        cy = add(cy);
        this.setState({cy:cy});
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
        else if(nextProps.canvasAnimation.type==="Search")
            search(cy,nextProps.canvasAnimation.label);
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
        pitfall_affected_elements : state.RootReducer.canvasAnimations.affected_elements,
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(CytoscapeRenderer);
