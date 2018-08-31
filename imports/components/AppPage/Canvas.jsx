import React, {Component} from 'react';
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import undoRedo from 'cytoscape-undo-redo';
import navigator from 'cytoscape-navigator';
import panzoom from 'cytoscape-panzoom';
import popper from 'cytoscape-popper';
import {DEF_VISUAL_STYLE} from '../../cytoscape/visual-style';
import {Random} from 'meteor/random';
import {Grid,Loader,Card,Transition} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {select, draw, showNeighborhood,addhistory} from '../../redux/actions/actioncreators';

import {
    showNeighborhoods,
    resetCanvas,
    showPitfalls,
    selectNode,
    unselectNode,
    search,
    showRestrictions, add2,
    MakeTippy
} from "../../cytoscape/functions";
import OPTIONS from "../../cytoscape/colajs-options";


class CytoscapeRenderer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cy: null,
            draw: true,
            png : null,
            loading : true,
            ur : null,
            navigator_visible: false
        };
    }

    componentDidMount() {
        console.log("after mount");
        let self = this;
        add2(function (res) {
            if (res.length !== 0) {

                cytoscape.use(cola);
                cytoscape.use( popper );
                undoRedo( cytoscape );
                navigator( cytoscape);
                panzoom( cytoscape );

                let cy = cytoscape({
                    container: document.getElementById('canvas'),
                    //layout:OPTIONS,
                    elements: res,
                    style: DEF_VISUAL_STYLE,
                    wheelSensitivity: 1,
                    //hideEdgesOnViewport : true
                });

                var defaults = {
                    container: document.getElementById('nav') // can be a HTML or jQuery element or jQuery selector
                    , viewLiveFramerate: 0 // set false to update graph pan only on drag end; set 0 to do it instantly; set a number (frames per second) to update not more than N times per second
                    , thumbnailEventFramerate: 30 // max thumbnail's updates per second triggered by graph updates
                    , thumbnailLiveFramerate: false // max thumbnail's updates per second. Set false to disable
                    , dblClickDelay: 200 // milliseconds
                    , removeCustomContainer: true // destroy the container specified by user on plugin destroy
                    , rerenderDelay: 100 // ms to throttle rerender updates to the panzoom for performance
                };

                cy.navigator( defaults ); // get navigator instance, nav

                var options = {
                    isDebug: false, // Debug mode for console messages
                    actions: {},// actions to be added
                    undoableDrag: true, // Whether dragging nodes are undoable can be a function as well
                    stackSizeLimit: undefined, // Size limit of undo stack, note that the size of redo stack cannot exceed size of undo stack
                    ready: function () { // callback when undo-redo is ready

                    }
                }

                var ur = cy.undoRedo(options); // Can also be set whenever wanted.


                var defaults = {
                    zoomFactor: 0.05, // zoom factor per zoom tick
                    zoomDelay: 45, // how many ms between zoom ticks
                    minZoom: 0.1, // min zoom level
                    maxZoom: 10, // max zoom level
                    fitPadding: 50, // padding when fitting
                    panSpeed: 10, // how many ms in between pan ticks
                    panDistance: 10, // max pan distance per tick
                    panDragAreaSize: 75, // the length of the pan drag box in which the vector for panning is calculated (bigger = finer control of pan speed and direction)
                    panMinPercentSpeed: 0.25, // the slowest speed we can pan by (as a percent of panSpeed)
                    panInactiveArea: 8, // radius of inactive area in pan drag box
                    panIndicatorMinOpacity: 0.5, // min opacity of pan indicator (the draggable nib); scales from this to 1.0
                    zoomOnly: false, // a minimal version of the ui only with zooming (useful on systems with bad mousewheel resolution)
                    fitSelector: undefined, // selector of elements to fit
                    animateOnFit: function(){ // whether to animate on fit
                        return false;
                    },
                    fitAnimationDuration: 1000, // duration of animation on fit

                    // icon class names
                    sliderHandleIcon: 'fa fa-minus',
                    zoomInIcon: 'fa fa-plus',
                    zoomOutIcon: 'fa fa-minus',
                    resetIcon: 'fa fa-expand'
                };  //icons should implement for semantic-ui

                cy.panzoom( defaults );



                cy.on('mouseover', 'node', function(event){
                    event.target.addClass("hover");
                });


                cy.on('mouseout', 'node', function(event){
                    event.target.removeClass("hover");
                });

                cy.on('tap', function(event){
                    self.props.select(event.target.id());
                });

                cy.on("afterUndo", function (event, actionName, args) {
                    let str = "Undo " + args.nodes[0].data().label + "  " + actionName;
                    self.props.addHistory(str);
                });
                cy.on("afterRedo", function (event, actionName, args) {
                    let str = "Redo " + args.nodes[0].data().label + "  " + actionName;
                    self.props.addHistory(str);
                });
                cy.on("afterDo", function (event, actionName, args) {
                    let str = "Do " + args.nodes[0].data().label + "  " + actionName;
                    self.props.addHistory(str);
                });
                
                cy.ready(function (event) {
                    if(event)
                        self.setState({loading: false})
                });

                self.setState({
                    cy: cy,
                    ur: ur
                });

            }
        });

    }

    componentWillReceiveProps(nextProps) {
        let cy = this.state.cy;
        let ur = this.state.ur;
        if (this.props.selectedNode !== nextProps.selectedNode) {
            unselectNode(cy, this.props.selectedNode);
            selectNode(cy, nextProps.selectedNode);
        }
        if (nextProps.canvasAnimation.type === "Undo"){
            ur.undo();
        }
        else  if (nextProps.canvasAnimation.type === "Redo")
        {
            console.log("redo");
            ur.redo();
        }
        else  if (nextProps.canvasAnimation.type === "Pop-up")
        {
            console.log(nextProps.selectedNode);
            let node = cy.getElementById(nextProps.selectedNode);
            let tip = MakeTippy(node,nextProps.selectedNode);
            tip.show();
            Meteor.setTimeout(function() {
                tip.hide();
            }, 1500);
        }
        else if (this.props.canvasAnimation.type === nextProps.canvasAnimation.type) {
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
            console.log(this.props.canvasProperties);
            return (<Grid>
                <Loader/>
                <Grid.Row>
                    <Grid.Column id="canvas">
                        <Grid.Row className="cy-panzoom" />
                            <Loader active = {this.state.loading} />
                            <Transition visible={this.props.canvasProperties.navigator} animation='scale' duration={500}>
                                <Card id="nav"> </Card>
                            </Transition>
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
        },
        addHistory: function (event) {
            return dispatch(addhistory(event))
        }
    }
};

const mapStateToProps = state => {
    return {
        canvas: state.RootReducer.draw,
        selectedNode: state.RootReducer.selectedNode,
        canvasAnimation: state.RootReducer.canvasAnimations,
        canvasProperties: state.RootReducer.canvasProperties,
        pitfall_affected_elements: state.RootReducer.canvasAnimations.affected_elements,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CytoscapeRenderer);
