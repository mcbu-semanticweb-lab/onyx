import React, { Component} from 'react';
import  Renderer  from '../components/Cytoscape_Renderer';
import   Info    from '../components/Cytoscape_Info';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar';
import injectTapEventPlugin from 'react-tap-event-plugin';

export default class App extends Component {
        constructor(props){
            super(props);
            injectTapEventPlugin();
        }

        render() {
            return <MuiThemeProvider>
                <div>
                <AppBar
                    showMenuIconButton = {false}
                    title = "Ontology Visualization with Meteorjs+Cytoscapejs"
                    zDepth={1}/>
                <Renderer/>
                <Info/>
                </div>
            </MuiThemeProvider>
        }
}
