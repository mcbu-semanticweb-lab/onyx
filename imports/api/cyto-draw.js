import {Random} from 'meteor/random';


Meteor.Cytoscape = {
    Draw : function (cy,Renderer) {
        Meteor.call('ranges', (error, result) => {
            if(error)
                console.log(error);
            if(result)
                _.each(result,function (triple) {
                    cy.add([
                        { group: "nodes", data: { id: triple.subject } },
                        { group: "nodes", data: { id: triple.object } },
                        { group: "edges", data: { id: Random.id() , source: triple.subject, target: triple.object  } }
                    ]);
                });
        });

        Meteor.call('domains', (error, result) => {
            if(error)
                console.log(error);
            if(result)
                _.each(result,function (triple) {
                    cy.add([
                        { group: "nodes", data: { id: triple.subject } },
                        { group: "nodes", data: { id: triple.object } },
                        { group: "edges", data: { id: Random.id() , source: triple.subject, target: triple.object } }
                    ]);
                });
            Renderer.setState({cy : cy});
        });
    },
};