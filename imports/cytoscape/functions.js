import {ontology_data} from "../api/data";
import OPTIONS from "./colajs-options";
import {Random} from 'meteor/random';


export function showNeighborhoods(id, cy) {
    ele = cy.getElementById(id);
    eles = ele.neighborhood();
    console.log(eles);
    cy.nodes().difference(eles).style("display", "none");
    ele.style("display", "element");
    cy.animation({
        fit: {
            eles: eles
        }
    }).play();
}

export function resetCanvas(cy) {
    cy.nodes().style("display", "element");
    cy.filter('.pitfall').forEach(function (node) {
        node.removeClass('pitfall');
    });
    cy.filter('.select').forEach(function (node) {
        node.removeClass('select');
    });

    cy.fit();
}

export function showPitfalls(cy, eles) {

    if (eles.length === undefined) {
        cy.getElementById(eles["@value"]).addClass("pitfall");
    }
    else {
        eles.forEach(function (node) {
            cy.getElementById(node["@value"]).addClass("pitfall");
        });
    }
    let elements = cy.elements(".pitfall");
    cy.nodes().difference(elements).style("display", "none");
    cy.animation({
        fit: {
            eles: elements
        }
    }).play();
}

export function selectNode(cy, id) {
    console.log("select");
    cy.getElementById(id).addClass("select")
}

export function search(cy, string) {
    console.log(string);
    eles = cy.filter('[label = "' + string + '"]');
    console.log(eles);
    eles.addClass("select");
}


export function unselectNode(cy, id) {
    console.log("unselect");
    cy.getElementById(id).removeClass("select")
}


export function add(cy) {

    Meteor.call('get_subjects_and_their_predicates', function (err, res) {

        if (res) {

            res.forEach(function (object) {
                object.predicates.forEach(function (triple) {

                    if (triple.object === "http://www.w3.org/2002/07/owl#Class" || triple.object === "http://www.w3.org/2000/01/rdf-schema#Class") {

                        cy.add([
                            {
                                group: "nodes",
                                data: {
                                    id: object.id,
                                    label: object.id.slice(object.id.lastIndexOf('/') + 1).split('#').reverse()[0],
                                    group: "class"
                                }
                            },
                        ]);
                    }

                    else if (triple.object === "http://www.w3.org/2002/07/owl#ObjectProperty") {

                        cy.add([
                            {
                                group: "nodes",
                                data: {
                                    id: object.id,
                                    label: object.id.slice(object.id.lastIndexOf('/') + 1).split('#').reverse()[0],
                                    group: "object_property"
                                }
                            },
                        ]);
                    }

                    else if (triple.object === "http://www.w3.org/2002/07/owl#DatatypeProperty") {

                        cy.add([
                            {
                                group: "nodes",
                                data: {
                                    id: object.id,
                                    label: object.id.slice(object.id.lastIndexOf('/') + 1).split('#').reverse()[0],
                                    group: "datatype_property"
                                }
                            },
                        ]);
                    }

                    else if (triple.object === "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property") {
                        cy.add([
                            {
                                group: "nodes",
                                data: {
                                    id: object.id,
                                    label: object.id.slice(object.id.lastIndexOf('/') + 1).split('#').reverse()[0],
                                    group: "object_property"
                                }
                            },
                        ]);
                    }


                })
            });

            res.forEach(function (object) {

                object.predicates.forEach(function (triple) {

                    if (triple.predicate === "http://www.w3.org/2000/01/rdf-schema#domain") {
                        //console.log(cy.getElementById(triple.object));
                        if (triple.object === "http://www.w3.org/2000/01/rdf-schema#Literal") {

                            literal_id = Random.id();

                            cy.add([
                                {
                                    group: "nodes",
                                    data: {
                                        id: literal_id,
                                        label: "Literal",
                                    },
                                    style: {
                                        'shape': 'rectangle',
                                        'color': 'black',
                                        'width': '130%',
                                        'font-size': '9',
                                        'padding': '50%',
                                        'background-color': '#fc3',
                                        'border-style': 'dashed',
                                        'border-color': 'black',
                                        'border-width': '2'
                                    }
                                },
                                {
                                    group: "edges",
                                    data: {id: Random.id(), source: literal_id, target: object.id, group: "range"}
                                }
                            ]);


                        }
                    else if (triple.object === "http://www.w3.org/2002/07/owl#Thing") {

         /*                   thing_id = Random.id();

                            cy.add([
                                {
                                    group: "nodes",
                                    data: {
                                        id: thing_id,
                                        label: "Thing",
                                    },
                                    style: {
                                        'shape': 'ellipse',
                                        'background-color': '#fff',
                                        'text-valign': 'center',
                                        'border-style': 'dashed',
                                        'border-color': 'black',
                                        'border-width': '1',
                                        'height': '120',
                                        'width': '120'
                                    }
                                },
                                {
                                    group: "edges",
                                    data: {id: Random.id(), source: thing_id, target: object.id, group: "domain"}
                                }
                            ]);*/


                        }
                        else {
                            cy.add([
                                {
                                    group: "edges",
                                    data: {id: Random.id(), source: triple.object, target: object.id, group: "domain"}
                                }
                            ]);
                        }
                    }

                    else if (triple.predicate === "http://www.w3.org/2000/01/rdf-schema#range") {

                        if (triple.object === "http://www.w3.org/2000/01/rdf-schema#Literal") {

                            literal_id = Random.id();

                            cy.add([
                                {
                                    group: "nodes",
                                    data: {
                                        id: literal_id,
                                        label: "Literal",
                                    },
                                    style: {
                                        'shape': 'rectangle',
                                        'color': 'black',
                                        'width': '130%',
                                        'font-size': '9',
                                        'padding': '50%',
                                        'background-color': '#fc3',
                                        'border-style': 'dashed',
                                        'border-color': 'black',
                                        'border-width': '2'
                                    }
                                },
                                {
                                    group: "edges",
                                    data: {id: Random.id(), source: object.id, target: literal_id, group: "range"}
                                }
                            ]);


                        }
                        else if (triple.object === "http://www.w3.org/2002/07/owl#Thing") {

                           /* thing_id = Random.id();

                            cy.add([
                                {
                                    group: "nodes",
                                    data: {
                                        id: thing_id,
                                        label: "Thing",
                                    },
                                    style: {
                                        'shape': 'ellipse',
                                        'background-color': '#fff',
                                        'text-valign': 'center',
                                        'border-style': 'dashed',
                                        'border-color': 'black',
                                        'border-width': '1',
                                        'height': '120',
                                        'width': '120'
                                    }
                                },
                                {
                                    group: "edges",
                                    data: {id: Random.id(), source: object.id, target: thing_id, group: "range"}
                                }
                            ]);*/


                        }
                        else {
                            cy.add([
                                {
                                    group: "edges",
                                    data: {id: Random.id(), source: object.id, target: triple.object, group: "range"}
                                }
                            ]);
                        }
                    }

                    else {
                        // pass
                    }
                })
            });

        }
        let layout = cy.layout(OPTIONS);
        layout.run();
    });

    return cy;
}

/*  Meteor.call('get_triples_by_type', function (err, res) {
    res.forEach(function (triple) {
        if (triple.object.slice(triple.object.lastIndexOf('/') + 1).includes('Class')) {
            let size = ontology_data.findOne({class_name: triple.subject}).instance_number;

            cy.add([
                {
                    group: "nodes",
                    data: {
                        id: triple.subject,
                        label: triple.subject.slice(triple.subject.lastIndexOf('/') + 1).split('#').reverse()[0],
                        group: "class"
                    },
                    style: {
                        height: (size + 1) * 40,
                        width: (size + 1) * 40,
                    }
                },
            ]);

        }

        else {

            cy.add([
                {
                    group: "nodes",
                    data: {
                        id: triple.subject,
                        label: triple.subject.slice(triple.subject.lastIndexOf('/') + 1).split('#').reverse()[0],
                        group: "other"
                    }
                },
            ]);
        }

    });
});

Meteor.call('get_domains_for_visualize', function (err, res) {
    res.forEach(function (triple) {
        if (triple.object.includes('#')) {
            cy.add([
                {
                    group: "nodes",
                    data: {
                        id: triple.object,
                        label: triple.object.slice(triple.object.lastIndexOf('#')),
                        group: "literal"
                    }
                },
                {
                    group: "edges",
                    data: {id: Random.id(), source: triple.subject, target: triple.object, group: "domain"}
                }
            ]);
        }
        else {
            cy.add([
                {
                    group: "edges",
                    data: {id: Random.id(), source: triple.subject, target: triple.object, group: "domain"}
                }
            ]);
        }
    });
});

Meteor.call('get_ranges_for_visualize', function (err, res) {
    res.forEach(function (triple) {
        if (triple.object.includes('#')) {
            cy.add([
                {
                    group: "nodes",
                    data: {
                        id: triple.object,
                        label: triple.object.slice(triple.object.lastIndexOf('#')),
                        group: "literal"
                    }
                },
                {
                    group: "edges",
                    data: {id: Random.id(), source: triple.subject, target: triple.object, group: "range"}
                }
            ]);
        }
        else {
            cy.add([
                {
                    group: "edges",
                    data: {id: Random.id(), source: triple.subject, target: triple.object, group: "range"}
                }
            ]);
        }
    });
    let layout = cy.layout(OPTIONS);
    layout.run();
});
return cy;*/