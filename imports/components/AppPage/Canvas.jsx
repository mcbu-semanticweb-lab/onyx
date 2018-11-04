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
import {
    select,
    showNeighborhood,
    reset,
    searchRes,
    addHistory
} from '../../redux/actions/actioncreators';
import coseBilkent from 'cytoscape-cose-bilkent';

import { cookies } from '../../../client/main';

import {
    showNeighborhoods,
    resetCanvas,
    showPitfalls,
    selectNode,
    unselectNode,
    search,
    showRestrictions,
    MakeTippy,
    prepareData,
    hide,
    filter, ShowClassHierarchy
} from "../../cytoscape/functions";
import OPTIONS from "../../cytoscape/colajs-options";
import {navigator_options, panzoom_options, undo_redo_options} from "../../cytoscape/extensions-options";
var defaults = {
    name: 'cose-bilkent',
    // Called on `layoutready`
    ready: function () {
    },
    // Called on `layoutstop`
    stop: function () {
    },
    // Whether to include labels in node dimensions. Useful for avoiding label overlap
    nodeDimensionsIncludeLabels: false,
    // number of ticks per frame; higher is faster but more jerky
    refresh: 30,
    // Whether to fit the network view after when done
    fit: true,
    // Padding on fit
    padding: 150,
    // Whether to enable incremental mode
    randomize: true,
    // Node repulsion (non overlapping) multiplier
    nodeRepulsion: 4500,
    // Ideal (intra-graph) edge length
    idealEdgeLength: 350,
    // Divisor to compute edge forces
    edgeElasticity: 0.45,
    // Nesting factor (multiplier) to compute ideal edge length for inter-graph edges
    nestingFactor: 0.1,
    // Gravity force (constant)
    gravity: 0.25,
    // Maximum number of iterations to perform
    numIter: 1,
    // Whether to tile disconnected nodes
    tile: true,
    // Type of layout animation. The option set is {'during', 'end', false}
    animate: 'end',
    // Amount of vertical space to put between degree zero nodes during tiling (can also be a function)
    tilingPaddingVertical: 10,
    // Amount of horizontal space to put between degree zero nodes during tiling (can also be a function)
    tilingPaddingHorizontal: 10,
    // Gravity range (constant) for compounds
    gravityRangeCompound: 1.5,
    // Gravity force (constant) for compounds
    gravityCompound: 1.0,
    // Gravity range (constant)
    gravityRange: 3.8,
    // Initial cooling factor for incremental layout
    initialEnergyOnIncremental: 0.5
};

class CytoscapeRenderer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cy: null,
            png: null,
            loading: true,
            ur: null,
            navigator_visible: false
        };
    }

    componentDidMount() {
        let self = this;
        console.log("kce cookie : " + cookies.get('kce'));
        prepareData(cookies.get('kce'), function (data) {
            if (data.length !== 0) {
                console.log(data);
                cytoscape.use(coseBilkent); // register extension
                cytoscape.use(popper);
                undoRedo(cytoscape);
                navigator(cytoscape);
                panzoom(cytoscape);

                let cy = cytoscape({
                    container: document.getElementById('canvas'),
                    layout: defaults,
                    elements: data,
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
                    if (event) {
                        self.setState({loading: false});
                        // let ele = cy.nodes('node[group="class"]');
                        // let eles = ele.neighborhood();
                        // cy.nodes().difference(eles).style("display", "none");
                        // ele.style("display", "element");
                        cy.nodes("[[degree=0]]").style("display","none");
                    }

                });
                cy.zoom(0.3);
                cy.center();
                self.setState({
                    cy: cy,
                    ur: ur
                });


            }
        });

        Meteor.call('get_individual_num', function (err, res) {
            if (res)
                console.log("ind number is" + res);
        });


    }

    componentWillReceiveProps(nextProps) {  //TODO: UNSAFE method must change
        let cy = this.state.cy;
        let ur = this.state.ur;
        if (this.props.selectedNode !== nextProps.selectedNode) {
            unselectNode(cy, this.props.selectedNode);
            selectNode(cy, nextProps.selectedNode);
        }

        if (nextProps.searchReducer.type === 'Search') {
            console.log("search");
            let result = search(cy, nextProps.searchReducer.text);
            this.props.SearchRes(result);
        }


        if (!(this.props.canvasAnimation.animation && this.props.canvasAnimation.animation !== 'Reset' && this.props.canvasAnimation.animation === nextProps.canvasAnimation.animation)) {
            switch (nextProps.canvasAnimation.animation) {
                case "Undo":
                    ur.undo();
                    break;
                case "Redo":
                    ur.redo();
                    break;
                case "Pop-up":
                    console.log(nextProps.selectedNode);
                    let node = cy.getElementById(nextProps.selectedNode);
                    let tip = MakeTippy(node, nextProps.selectedNode);
                    tip.show();
                    Meteor.setTimeout(function () {
                        tip.hide();
                    }, 1500);
                    break;
                case "ResetCanvas":
                    resetCanvas(cy);
                    break;
                case "ShowPitfalls":
                    showPitfalls(cy, nextProps.pitfall_affected_elements);
                    break;
                case "ShowNeighborhood":
                    showNeighborhoods(nextProps.selectedNode, cy);
                    break;
                case "ShowRestriction":
                    console.log("restriction");
                    showRestrictions(nextProps.selectedNode, cy);
                    break;
                case "Hide":
                    hide(nextProps.selectedNode, cy);
                    break;
                case "Filter":
                    console.log("filter");
                    filter(cy, nextProps.canvasAnimation.filter_type, nextProps.canvasAnimation.checked);
                    break;
                case "ShowClassHierarchy":
                    ShowClassHierarchy(cy, nextProps.canvasAnimation.filter_type);
                    break;
                default:
                    break;
            }
        } //reset gelistirilebilir, kontrol saglanabılır, filter için arka arakaya gelen işlemi yapamıyor
        else {
            this.props.reset();
        }
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
        showNeighborhoods: function (boole) {
            return dispatch(showNeighborhood(boole))
        },
        addHistory: function (event) {
            return dispatch(addHistory(event))
        },
        SearchRes: function (result) {
            return dispatch(searchRes(result))
        },
        reset: function () {
            return dispatch(reset())
        },
    }
};

const mapStateToProps = state => {
    return {
        selectedNode: state.RootReducer.selectedNode,
        searchReducer: state.RootReducer.SearchReducer,
        canvasAnimation: state.RootReducer.canvasAnimations,
        canvasProperties: state.RootReducer.canvasProperties,
        pitfall_affected_elements: state.RootReducer.canvasAnimations.affected_elements,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CytoscapeRenderer);
