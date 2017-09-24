import React, { Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import cytoscape from 'cytoscape';
import {DEF_VISUAL_STYLE} from '../cytoscape/visual_style';
import OPTIONS from '../cytoscape/colajs-options';
import { connect } from 'react-redux'
import '../api/cyto-draw';
import '../styles/cyto-renderer.css';


let cy;

class CytoscapeRenderer extends Component {

    componentDidMount() {
        let cy = cytoscape({
            container: document.getElementById('cy'),
            style: DEF_VISUAL_STYLE,
        });
        let cycola = require('cytoscape-cola');
        cycola( cytoscape );
        Meteor.Cytoscape.Draw(cy,this);

    }

    componentDidUpdate(){
        cy = this.state.cy;
        let layout = cy.layout(OPTIONS);
        layout.run();
        //TODO:Fit
        this.setstate();
    }

    setstate(){
        let self = this;
        cy.on('tap', 'node', function(event){
            self.props.dispatch({type : 'SELECTED',payload: event.target.id()});
        });
    }

    render() {
        return <div id="cy"/>
    }

}

function mapDispatchToProps(dispatch) {
    return {dispatch}
}

export default connect(null,mapDispatchToProps)(CytoscapeRenderer);