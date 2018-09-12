import React, {Component} from 'react';
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import undoRedo from 'cytoscape-undo-redo';
import navigator from 'cytoscape-navigator';
import panzoom from 'cytoscape-panzoom';
import popper from 'cytoscape-popper';
import {DEF_VISUAL_STYLE} from '../../cytoscape/visual-style';
import {Random} from 'meteor/random';
import {Grid, Loader, Card, Transition} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {select, draw, showNeighborhood, addhistory, searchAC, searchRes} from '../../redux/actions/actioncreators';

import {
    showNeighborhoods,
    resetCanvas,
    showPitfalls,
    selectNode,
    unselectNode,
    search,
    showRestrictions, add2,
    MakeTippy,
    hide,
    filter
} from "../../cytoscape/functions";
import OPTIONS from "../../cytoscape/colajs-options";
import {navigator_options, panzoom_options, undo_redo_options} from "../../cytoscape/extensions-options";


class CytoscapeRenderer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cy: null,
            draw: true,
            png: null,
            loading: true,
            ur: null,
            navigator_visible: false
        };
    }

    componentDidMount() {
        console.log("after mount");
        let self = this;
        add2(function (res) {
            if (res.length !== 0) {

                cytoscape.use(cola);
                cytoscape.use(popper);
                undoRedo(cytoscape);
                navigator(cytoscape);
                panzoom(cytoscape);

                let cy = cytoscape({
                    container: document.getElementById('canvas'),
                    //layout:OPTIONS,
                    elements: res,
                    style: DEF_VISUAL_STYLE,
                    wheelSensitivity: 1,
                    //hideEdgesOnViewport : true
                });
                navigator_options.container = document.getElementById('nav');
                cy.navigator(navigator_options); // get navigator instance, nav

                var ur = cy.undoRedo(undo_redo_options); // Can also be set whenever wanted.

                cy.panzoom(panzoom_options);

                cy.on('mouseover', 'node', function (event) {
                    event.target.addClass("hover");
                });


                cy.on('mouseout', 'node', function (event) {
                    event.target.removeClass("hover");
                });

                cy.on('tap', 'node', function (event) {
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
                    if (event)
                        self.setState({loading: false})
                });
                cy.zoom(0.3);
                cy.center();
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
        if (nextProps.canvasAnimation.type === "Undo") {
            ur.undo();
        }
        else if (nextProps.canvasAnimation.type === "Redo") {
            console.log("redo");
            ur.redo();
        }
        else if (nextProps.canvasAnimation.type === "Pop-up") {
            console.log(nextProps.selectedNode);
            let node = cy.getElementById(nextProps.selectedNode);
            let tip = MakeTippy(node, nextProps.selectedNode);
            tip.show();
            Meteor.setTimeout(function () {
                tip.hide();
            }, 1500);
        }
        else if (nextProps.searchReducer.type === "Search") {
            let result = search(cy, nextProps.searchReducer.text);
            this.props.SearchRes(result);
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
        else if (nextProps.canvasAnimation.type === "Hide")
            hide(nextProps.selectedNode, cy);
        else if (nextProps.canvasAnimation.type === "Filter")
            filter(cy);
        //canvasAnimation burada yada calıstırılan fonk.ların sonunda resetlenebilir
    }


    render() {
        return (<Grid>
            <Loader/>
            <Grid.Row>
                <Grid.Column id="canvas">
                    <Grid.Row/>
                    <Loader active={this.state.loading}/>
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
        },
        SearchRes: function (result) {
            return dispatch(searchRes(result))
        },
    }
};

const mapStateToProps = state => {
    return {
        canvas: state.RootReducer.draw,
        selectedNode: state.RootReducer.selectedNode,
        searchReducer: state.RootReducer.SearchReducer,
        canvasAnimation: state.RootReducer.canvasAnimations,
        canvasProperties: state.RootReducer.canvasProperties,
        pitfall_affected_elements: state.RootReducer.canvasAnimations.affected_elements,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CytoscapeRenderer);
