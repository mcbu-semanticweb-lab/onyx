import OPTIONS from "./colajs-options";
import {Random} from 'meteor/random';
import tippy from 'tippy.js';

var list = [];

export function showNeighborhoods(id, cy) {
    ele = cy.edges('edge[group="subclass"]');
    console.log(ele);
    eles = ele.connectedNodes();
    console.log(eles);
    cy.nodes().difference(eles).style("display", "none");
    ele.style("display", "element");
    cy.animation({
        fit: {
            eles: eles
        }
    }).play();
}

export function showRestrictions(id, cy) {

    Meteor.call('find_attributes_restriction', id, function (err, res) {

        if (res) {
            res.forEach(function (triple) {

                console.log(triple);

                if (triple.predicate === "<http://www.w3.org/2002/07/owl#onProperty>") {

                    cy.add([
                        {
                            group: "nodes",
                            data: {
                                id: triple.subject,
                                label: triple.subject,
                                group: "object_property"
                            }
                        },
                    ]);


                    cy.add([
                        {
                            group: "edges",
                            data: {
                                id: Random.id(),
                                source: triple.object,
                                target: triple.subject,
                            },
                            style: {
                                label: triple.predicate,
                            }
                        }
                    ]);


                }

                else if (triple.object === "<http://www.w3.org/2002/07/owl#Restriction>") {
                    //pass

                    cy.add([
                        {
                            group: "nodes",
                            data: {
                                id: triple.object,
                                label: "R",
                                group: "restriction"
                            }
                        },
                    ]);

                    cy.add([
                        {
                            group: "edges",
                            data: {
                                id: Random.id(),
                                source: triple.object,
                                target: triple.subject,
                            },
                            style: {
                                label: triple.predicate
                            }
                        }
                    ]);
                }
                else {

                    if (triple.object.includes('_:')) {


                        cy.add([
                            {
                                group: "nodes",
                                data: {
                                    id: triple.object,
                                    label: "A",
                                    group: "restriction"
                                }
                            },
                        ]);

                        cy.add([
                            {
                                group: "edges",
                                data: {
                                    id: Random.id(),
                                    source: triple.object,
                                    target: triple.subject,
                                },
                                style: {
                                    label: triple.predicate
                                }
                            }
                        ]);

                        Meteor.call('find_attributes_restriction', triple.object, function (err, res) {

                            if (res) {

                                console.log(triple);

                                get_list(triple.object, function (err, res) {
                                    console.log(err, res);
                                });
                            }


                        })


                    }


                    else {

                        cy.add([
                            {
                                group: "nodes",
                                data: {
                                    id: triple.object,
                                    label: triple.object.slice(triple.object.lastIndexOf('/') + 1).split('#').reverse()[0],
                                    group: "class"
                                }
                            },
                        ]);

                        cy.add([
                            {
                                group: "edges",
                                data: {
                                    id: Random.id(),
                                    source: triple.object,
                                    target: triple.subject,
                                },
                                style: {
                                    label: triple.predicate
                                }
                            }
                        ]);

                    }

                }
            });

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
    });

}

export function resetCanvas(cy) {
    cy.nodes().style("display", "element");
    cy.filter('.pitfall').forEach(function (node) {
        node.removeClass('pitfall');
    });
    cy.filter('.select').forEach(function (node) {
        node.removeClass('select');
    });
    let layout = cy.layout(OPTIONS);
    layout.run();
    cy.fit();
}

export function showPitfalls(cy, eles) {
    if (eles.length === undefined) {
        cy.getElementById(eles["@value"]).addClass("pitfall");
    }
    else {
        eles.forEach(function (node) {
            console.log(node,node["@value"]);
            cy.getElementById(node["@value"]).addClass("pitfall");
        });
    }
    let elements = cy.elements(".pitfall");
    console.log(elements);
    //cy.nodes().difference(elements).style("display", "none");
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

export function search(cy, text) {
    let result = [];
    let eles = cy.nodes('[label @*= "' + text + '"]');
    eles.forEach(function (ele) {
        result.push({
            key: Random.id(),
            id: ele.data('id'),
            title: ele.data('label')
        });
    });
    return result;
}


export function unselectNode(cy, id) {
    console.log("unselect");
    cy.getElementById(id).removeClass("select")
}

export function hide(id, cy) {
    cy.getElementById(id).style("display", "none");
}

export function add2(callback) {

    data = [];

    Meteor.call('get_subjects_and_their_predicates', function (err, res) {

        if (err)
            console.log(err);

        if (res) {
            res.forEach(function (object) {
                object.predicates.forEach(function (triple) {

                    if (triple.object === "http://www.w3.org/2002/07/owl#Class" || triple.object === "http://www.w3.org/2000/01/rdf-schema#Class") {

                        if (object.id.includes('_:')) {
                            console.log("pass");
                        }
                        else {

                            data.push(
                                {
                                    group: "nodes",
                                    data: {
                                        id: object.id,
                                        label: object.id.slice(object.id.lastIndexOf('/') + 1).split('#').reverse()[0],
                                        group: "class"
                                    }
                                },
                            );
                        }
                    }


                    else if (triple.object === "http://www.w3.org/2002/07/owl#ObjectProperty") {

                        data.push(
                            {
                                group: "nodes",
                                data: {
                                    id: object.id,
                                    label: object.id.slice(object.id.lastIndexOf('/') + 1).split('#').reverse()[0],
                                    group: "object_property"
                                }
                            },
                        );
                    }

                    else if (triple.object === "http://www.w3.org/2002/07/owl#DatatypeProperty") {

                        data.push(
                            {
                                group: "nodes",
                                data: {
                                    id: object.id,
                                    label: object.id.slice(object.id.lastIndexOf('/') + 1).split('#').reverse()[0],
                                    group: "datatype_property"
                                }
                            },
                        );
                    }

                    else if (triple.object === "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property") {
                        data.push(
                            {
                                group: "nodes",
                                data: {
                                    id: object.id,
                                    label: object.id.slice(object.id.lastIndexOf('/') + 1).split('#').reverse()[0],
                                    group: "object_property"
                                }
                            },
                        );
                    }

                    else if (triple.object === "http://www.w3.org/2002/07/owl#Restriction") {
                        data.push(
                            {
                                group: "nodes",
                                data: {
                                    id: object.id,
                                    label: "R",
                                    group: "restriction"
                                }
                            },
                        );
                    }

                    else {
                        //pass
                    }

                })
            }); //Node Adding

            res.forEach(function (object) {

                object.predicates.forEach(function (triple) {
                    //console.log(object.id, triple.predicate, triple.id);

                    if (triple.predicate === "http://www.w3.org/2000/01/rdf-schema#domain") {
                        //console.log(cy.getElementById(triple.object));
                        if (triple.object === "http://www.w3.org/2000/01/rdf-schema#Literal") {

                            literal_id = Random.id();

                            data.push(
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
                            );


                        }

                        // else if (triple.object === "<http://www.w3.org/2002/07/owl#Thing>") {
                        //     range = "thing_".concat(object.predicates.find(find_range).object);
                        //
                        //     data.push(
                        //         {
                        //             group: "nodes",
                        //             data: {
                        //                 id: range,
                        //                 label: "Thing",
                        //             },
                        //             style: {
                        //                 'shape': 'ellipse',
                        //                 'background-color': '#fff',
                        //                 'text-valign': 'center',
                        //                 'border-style': 'dashed',
                        //                 'border-color': 'black',
                        //                 'border-width': '1',
                        //                 'height': '120',
                        //                 'width': '120'
                        //             }
                        //         },
                        //         {
                        //             group: "edges",
                        //             data: {id: Random.id(), source: range, target: object.id, group: "domain"}
                        //         }
                        //     );
                        //
                        //
                        // }

                        else {
                            data.push(
                                {
                                    group: "edges",
                                    data: {
                                        id: Random.id(),
                                        source: triple.object,
                                        target: object.id,
                                        group: "domain"
                                    }
                                }
                            );
                        }
                    }

                    else if (triple.predicate === "http://www.w3.org/2000/01/rdf-schema#range") {

                        if (triple.object === "http://www.w3.org/2000/01/rdf-schema#Literal") {

                            literal_id = Random.id();

                            data.push(
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
                            );


                        }

                        // else if (triple.object === "<http://www.w3.org/2002/07/owl#Thing>") {
                        //     let domain = object.predicates.find(find_domain).object.concat('_thing');
                        //
                        //     data.push(
                        //         {
                        //             group: "nodes",
                        //             data: {
                        //                 id: domain,
                        //                 label: "Thing",
                        //             },
                        //             style: {
                        //                 'shape': 'ellipse',
                        //                 'background-color': '#fff',
                        //                 'text-valign': 'center',
                        //                 'border-style': 'dashed',
                        //                 'border-color': 'black',
                        //                 'border-width': '1',
                        //                 'height': '120',
                        //                 'width': '120'
                        //             }
                        //         },
                        //         {
                        //             group: "edges",
                        //             data: {id: Random.id(), source: object.id, target: domain, group: "range"}
                        //         }
                        //     );
                        //
                        //
                        // }

                        else {
                            data.push(
                                {
                                    group: "edges",
                                    data: {
                                        id: Random.id(),
                                        source: object.id,
                                        target: triple.object,
                                        group: "range"
                                    }
                                }
                            );
                        }
                    }

                    else if (triple.predicate === "http://www.w3.org/2000/01/rdf-schema#subClassOf") {
                        if (triple.id === "http://www.w3.org/2002/07/owl#Thing") {
                            //pass
                        }
                        else if (triple.id.startsWith("_:")) {
                            //pass
                        }
                        else {
                            data.push(
                                {
                                    group: "nodes",
                                    data: {
                                        id: object.id,
                                        label: object.id.slice(object.id.lastIndexOf('/') + 1).split('#').reverse()[0],
                                        group: "object_property"
                                    }
                                },
                                {
                                    group: "edges",
                                    data: {id: Random.id(), source: object.id, target: triple.id, group: "subclass"}
                                }
                            );
                        }
                    }

                    else {
                        // pass
                    }

                })
            }); //Edge Adding*!/*/

        }
        console.log(data.length);
        return callback(data)
        /*
        let layout = cy.layout(OPTIONS);
        layout.run();*/
    });
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


/*
res.nodes.forEach(function (object) {
    if(object["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]){
        if (object["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"] === "http://www.w3.org/2002/07/owl#Class") {
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

        else if (object["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"] === "http://www.w3.org/2002/07/owl#ObjectProperty") {

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

        else if (object["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"] === "http://www.w3.org/2002/07/owl#DatatypeProperty") {

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

        else if (object["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"] === "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property") {
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
    }
});
*/


function find_domain(obj) {
    return obj.predicate === "http://www.w3.org/2000/01/rdf-schema#domain";
}

function find_range(obj) {
    return obj.predicate === "http://www.w3.org/2000/01/rdf-schema#range";
}


function get_list(id, callback) {
    Meteor.call('get_list', id, function (err, res) {
        if (res) {
            if (res.rest !== null)
                get_list(id);
            else
                list.append(res);
            callback(list)
        }
    })
}

export function filter(cy, filter_type, checked) {
    let ele = cy.edges('edge[group="' + filter_type + '"]');
    let eles = ele.connectedNodes();
    if (checked) {
        cy.nodes().difference(eles).style("display", "none");

    }
    else{
        cy.nodes().difference(eles).style("display", "element");
    }
    //hiyerarşik gösterim eklenebilir
    //animasyon eklenebilir
}

/*
export function hideRestriction(cy) {
    ele = cy.edges('edge[group="restriction"]');
    eles = ele.connectedNodes();
    cy.nodes().difference(eles).style("display", "none");
    ele.style("display", "element");
    cy.animation({
        fit: {
            eles: eles
        }
    }).play();
}

export function hideAnonymous(cy) {
    ele = cy.edges('edge[group="anonymous"]');
    eles = ele.connectedNodes();
    cy.nodes().difference(eles).style("display", "none");
    ele.style("display", "element");
    cy.animation({
        fit: {
            eles: eles
        }
    }).play();
}

export function hideDatatype(cy) {
    ele = cy.edges('edge[group="datatype"]');
    eles = ele.connectedNodes();
    cy.nodes().difference(eles).style("display", "none");
    ele.style("display", "element");
    cy.animation({
        fit: {
            eles: eles
        }
    }).play();
}

export function hideObjectproperty(cy) {
    ele = cy.edges('edge[group="objectproperty"]');
    eles = ele.connectedNodes();
    cy.nodes().difference(eles).style("display", "none");
    ele.style("display", "element");
    cy.animation({
        fit: {
            eles: eles
        }
    }).play();
}

hideIntersectionOf,hideUnionOf,hideEnumeratedClasses,hidePropertyCharacteristics





*/

/*
TODO : filter için

ele = cy.edges('edge[group="subclass"]');
console.log(ele);
eles = ele.connectedNodes();
console.log(eles);
cy.nodes().difference(eles).style("display", "none");
ele.style("display", "element");
cy.animation({
    fit: {
        eles: eles
    }
}).play();*/


export function MakeTippy(node, text) {
    console.log(node, text);
    return tippy(node.popperRef(), {
        html: (function () {
            var div = document.createElement('div');
            div.innerHTML = text;
            return div;
        })(),
        trigger: 'manual',
        arrow: false,
        placement: 'bottom',
        hideOnClick: false,
        multiple: false,
        sticky: true
    }).tooltips[0];
};