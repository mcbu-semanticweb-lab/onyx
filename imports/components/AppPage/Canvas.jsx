import React, {Component} from 'react';
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import {DEF_VISUAL_STYLE} from '../../cytoscape/visual-style';
import {Random} from 'meteor/random';
import {Grid,Loader} from 'semantic-ui-react';

import {connect} from 'react-redux';
import {select, draw, showNeighborhood} from '../../redux/actions/actioncreators';

import {
    showNeighborhoods,
    resetCanvas,
    showPitfalls,
    selectNode,
    unselectNode,
    search,
    showRestrictions, add2
} from "../../cytoscape/functions";
import OPTIONS from "../../cytoscape/colajs-options";


class CytoscapeRenderer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cy: null,
            draw: true,
            png : null,
            loading : true
        };
    }

    componentDidMount() {
        console.log("after mount");
        let self = this;
        add2(function (res) {
            if (res.length !== 0) {

                cytoscape.use(cola);

                let cy = cytoscape({
                    container: document.getElementById('cy'),
                    //layout:OPTIONS,
                    elements: res,
                    style: DEF_VISUAL_STYLE,
                    wheelSensitivity: 1,
                    //hideEdgesOnViewport : true
                });

                cy.on('mouseover', 'node', function(event){
                    event.target.addClass("hover");
                });


                cy.on('mouseout', 'node', function(event){
                    event.target.removeClass("hover");
                });

                cy.on('tap', function(event){
                    self.props.select(event.target.id());
                });
                
                cy.ready(function (event) {
                    if(event)
                        self.setState({loading: false})
                });

                self.setState({cy: cy});

            }
        });

    }

    componentWillReceiveProps(nextProps) {
        let cy = this.state.cy;
        if (this.props.selectedNode !== nextProps.selectedNode) {
            unselectNode(cy, this.props.selectedNode);
            selectNode(cy, nextProps.selectedNode);
        }
        if (this.props.canvasAnimation.type === nextProps.canvasAnimation.type) {
            console.log("states are equal");
        }
        else if (nextProps.canvasAnimation.type === "ResetCanvas") //reset sonrası select
            resetCanvas(cy);
        //else if(this.props.canvasAnimation.animation&&nextProps.canvasAnimation.animation)
        //  resetCanvas(cy);
        else if (nextProps.canvasAnimation.type === "ShowPitfalls")
            showPitfalls(cy, nextProps.pitfall_affected_elements);
        else if (nextProps.canvasAnimation.type === "ShowNeighborhood")
            showNeighborhoods(nextProps.selectedNode, cy);
        else if (nextProps.canvasAnimation.type === "ShowRestriction")
            showRestrictions(nextProps.selectedNode, cy);
        else if (nextProps.canvasAnimation.type === "Search")
            search(cy, nextProps.canvasAnimation.label);
    }


    render() {
            return (<Grid>
                <Loader/>
                <Grid.Row>
                    <Grid.Column>
                        <div id="cy">
                            <Loader active = {this.state.loading} />
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>);
    };
}

const mapDispatchToProps = dispatch => {
    return {
        select: function (id) {
            return (dispatch(select(id)));
        },
        draw: function (boole) {
            return (dispatch(draw(boole)))
        },
        showNeighborhoods: function (boole) {
            return dispatch(showNeighborhood(boole))
        }
    }
};

const mapStateToProps = state => {
    return {
        canvas: state.RootReducer.draw,
        selectedNode: state.RootReducer.selectedNode,
        canvasAnimation: state.RootReducer.canvasAnimations,
        pitfall_affected_elements: state.RootReducer.canvasAnimations.affected_elements,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CytoscapeRenderer);
