import OPTIONS from "./colajs-options";
import {Random} from 'meteor/random';
import tippy from 'tippy.js';
import {cookies} from "../../client/main";

var list = [];

var defaults = {
    name: 'cose-bilkent',
    animationEasing: 'ease-in-cubic',
    animationDuration: 1000,
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
    idealEdgeLength: 50,
    // Divisor to compute edge forces
    edgeElasticity: 0.45,
    // Nesting factor (multiplier) to compute ideal edge length for inter-graph edges
    nestingFactor: 0.1,
    // Gravity force (constant)
    gravity: 0.25,
    // Maximum number of iterations to perform
    numIter: 2500,
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

export function showNeighborhoods(id, cy) {
    let ele = cy.getElementById(id);
    let eles = ele.neighborhood();
    cy.nodes().difference(eles).style("display", "none");
    ele.style("display", "element");
    cy.animation({
        fit: {
            eles: eles
        }
    }).play();

}

async function restriction_helper(source, target, type, cy) {
    console.log(source, target, type, cy);

    if (target.includes('_:')) {
        let collection = await get_collection(target);

        console.log(collection);

        cy.add([
            {
                group: "nodes",
                data: {
                    id: target,
                    label: "oneOf",
                    group: "oneOf",
                },
                classes: 'extra',
            },
        ]);

        cy.add([
            {
                group: "edges",
                data: {
                    id: Random.id(),
                    source: source,
                    target: target,
                },
                classes: 'extra',
            }
        ]);

        for (let node of collection) {
            if (node.type === "http://www.w3.org/1999/02/22-rdf-syntax-ns#first") {
                cy.add([
                    {
                        group: "nodes",
                        data: {
                            id: node.id,
                            label: node.id,
                            group: "item",
                        },
                        classes: 'extra',
                    },
                ]);


                cy.add([
                    {
                        group: "edges",
                        data: {
                            id: Random.id(),
                            source: target,
                            target: node.id,
                        },
                        style: {
                            label: type,
                        },
                        classes: 'extra',
                    }
                ]);
            }
        }
    }
    else {
        cy.add([
            {
                group: "nodes",
                data: {
                    id: target,
                    label: target,
                    group: type,
                },
                classes: 'extra',
            },
        ]);

        cy.add([
            {
                group: "edges",
                data: {
                    id: Random.id(),
                    source: source,
                    target: target,
                },
                style: {
                    label: type,
                },
                classes: 'extra',
            }
        ]);
    }


}

export function showRestrictions(id, cy) {

    Meteor.call('find_attributes', id, async function (err, res) {

        if (res) {
            for (let triple of res) {
                if (triple.predicate === "http://www.w3.org/2002/07/owl#onProperty") {

                    await restriction_helper(triple.subject, triple.object, "onProperty", cy);

                }

                else {
                    switch (triple.predicate) {
                        case "http://www.w3.org/2002/07/owl#hasValue":
                            await restriction_helper(triple.subject, triple.object, "hasValue", cy);
                            cy.getElementById(triple.subject).data('label', '∃r.{x}'); //TODO : formal gösterimler için unicode?
                            break;
                        case "http://www.w3.org/2002/07/owl#allValuesFrom":
                            await restriction_helper(triple.subject, triple.object, "allValuesFrom", cy);
                            cy.getElementById(triple.subject).data('label', '∀R.C');
                            break;
                        case "http://www.w3.org/2002/07/owl#someValuesFrom":
                            await restriction_helper(triple.subject, triple.object, "someValuesFrom", cy);
                            cy.getElementById(triple.subject).data('label', '∃R.C');
                            break;
                        case "http://www.w3.org/2002/07/owl#cardinality":
                            await restriction_helper(triple.subject, triple.object, "cardinality", cy);
                            cy.getElementById(triple.subject).data('label', '= nR');
                            break;
                        case "http://www.w3.org/2002/07/owl#maxCardinality":
                            await restriction_helper(triple.subject, triple.object, "maxCardinality", cy);
                            cy.getElementById(triple.subject).data('label', '≥ nR');
                            break;
                        case "http://www.w3.org/2002/07/owl#minCardinality":
                            await restriction_helper(triple.subject, triple.object, "minCardinality", cy);
                            cy.getElementById(triple.subject).data('label', '≤ nR');
                            break;


                        default:
                            break;

                    }

                }
            }

            let ele = cy.getElementById(id);
            let eles = ele.neighborhood();

            let eles2 = cy.nodes('');
            console.log(eles2.jsons());
            cy.filter('.extra').union(ele).union(eles).style("display", "element");
            //let ly = cy.layout(defaults);
            //ly.run();
            cy.animation({
                center: {
                    eles: eles
                }
            }).play();

        }
    });

}

export function resetCanvas(cy) {
    let inv = cy.nodes('node[group="invisible"]');
    console.log(inv);
    cy.nodes().difference(inv).style("display", "element");
    cy.filter('.extra').forEach(function (node) {
        node.remove();
    });
    cy.filter('.pitfall').forEach(function (node) {
        node.removeClass('pitfall');
    });
    cy.filter('.select').forEach(function (node) {
        node.removeClass('select');
    });
    // let layout = cy.layout(OPTIONS);
    // layout.run();
    cy.fit();
}

export function showPitfalls(cy, eles) {
    if (eles.length === undefined) {
        cy.getElementById(eles["@value"]).addClass("pitfall");
    }
    else {
        eles.forEach(function (node) {
            console.log(node, node["@value"]);
            cy.getElementById(node["@value"]).addClass("pitfall");
        });
    }
    let elements = cy.elements(".pitfall");
    console.log(elements);
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

export async function prepareData(kce, callback) {

    let nodes = [];
    let edges = [];

    let triples = await get_triples(cookies.get('namespace'));

    let addNodes = nodeAdd(kce, nodes, triples);
    let addEdges = edgeAdd(edges, triples);
    Promise.all([addNodes, addEdges]).then(([nodes, edges]) => {

        return callback(nodes.concat(edges));


    });
}


function nodeAdd(kce, data, triples) {
    return new Promise(async function (resolve, reject) {
        let kce_classes = [];
        if (kce === true) {
            kce_classes = await get_kce();
            console.log(kce_classes)
        }
        for (let object of triples) {
            for (let triple of object.predicates) {

                if (triple.predicate === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
                    switch (triple.object) {
                        case "http://www.w3.org/2002/07/owl#Class" :
                        case "http://www.w3.org/2000/01/rdf-schema#Class":
                            if (object.id.includes('_:')) {
                                //pass
                            }
                            else {
                                if (kce === true) {
                                    console.log(object.id, kce_classes.includes(object.id));
                                    if (kce_classes.includes(object.id)) {
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
                                    else {
                                        data.push(
                                            {
                                                group: "nodes",
                                                data: {
                                                    id: object.id,
                                                    label: object.id.slice(object.id.lastIndexOf('/') + 1).split('#').reverse()[0],
                                                    group: "invisible"
                                                }
                                            },
                                        );
                                    }
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
                            break;

                        case "http://www.w3.org/2002/07/owl#ObjectProperty":
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
                            break;

                        case "http://www.w3.org/2002/07/owl#DatatypeProperty":
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
                            break;

                        case "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property":
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
                            break;
                        case "http://www.w3.org/2002/07/owl#SymmetricProperty":
                            data.pop();
                            data.push(
                                {
                                    group: "nodes",
                                    data: {
                                        id: object.id,
                                        label: object.id.slice(object.id.lastIndexOf('/') + 1).split('#').reverse()[0] + "(symmetric)",
                                        group: "symmetric_property"
                                    }
                                },
                            );
                            break;

                        case "http://www.w3.org/2002/07/owl#TransitiveProperty":
                            data.pop();
                            data.push(
                                {
                                    group: "nodes",
                                    data: {
                                        id: object.id,
                                        label: object.id.slice(object.id.lastIndexOf('/') + 1).split('#').reverse()[0] + "(transitive)",
                                        group: "object_property"
                                    }
                                },
                            );
                            break;

                        case "http://www.w3.org/2002/07/owl#FunctionalProperty":
                            data.pop();
                            data.push(
                                {
                                    group: "nodes",
                                    data: {
                                        id: object.id,
                                        label: object.id.slice(object.id.lastIndexOf('/') + 1).split('#').reverse()[0] + "(functional)",
                                        group: "object_property"
                                    }
                                },
                            );
                            break;

                        case "http://www.w3.org/2002/07/owl#InverseFunctionalProperty":
                            data.pop();
                            data.push(
                                {
                                    group: "nodes",
                                    data: {
                                        id: object.id,
                                        label: object.id.slice(object.id.lastIndexOf('/') + 1).split('#').reverse()[0] + "(inverse functional)",
                                        group: "object_property"
                                    }
                                },
                            );
                            break;


                        case "http://www.w3.org/2002/07/owl#Restriction":
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
                            break;

                        case "http://www.w3.org/2002/07/owl#Thing":
                            data.push(
                                {
                                    group: "nodes",
                                    data: {
                                        id: object.id,
                                        label: object.id.slice(object.id.lastIndexOf('/') + 1).split('#').reverse()[0],
                                        group: "thing"
                                    }
                                },
                            );
                            break;

                        default:
                        //console.log("unexpected type");
                    }
                }
            }
        }

        resolve(data);

    });
}


function edgeAdd(data, triples) {
    return new Promise(async function (resolve, reject) {

        for (let object of triples) {
            for (let triple of object.predicates) {

                if (triple.predicate === "http://www.w3.org/2000/01/rdf-schema#domain") {

                    if (triple.object === "http://www.w3.org/2000/01/rdf-schema#Literal") {

                        let literal_id = Random.id();

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

                        let literal_id = Random.id();

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
                    else {
                        data.push(
                            {
                                group: "edges",
                                data: {id: Random.id(), source: object.id, target: triple.id, group: "subclass"}
                            }
                        );
                    }
                }

                else if (triple.predicate === "http://www.w3.org/2002/07/owl#intersectionOf") {


                    data.push(
                        {
                            group: "nodes",
                            data: {
                                id: triple.id,
                                label: "∩",
                                group: "intersectionOf"
                            }
                        },
                        {
                            group: "edges",
                            data: {id: Random.id(), source: object.id, target: triple.id}
                        }
                    );

                    await get_collection_and_add(triple.id, data);


                }

                else if (triple.predicate === "http://www.w3.org/2002/07/owl#unionOf") {


                    data.push(
                        {
                            group: "nodes",
                            data: {
                                id: triple.id,
                                label: "∪",
                                group: "unionOf"
                            }
                        },
                        {
                            group: "edges",
                            data: {id: Random.id(), source: object.id, target: triple.id}
                        }
                    );

                    await get_collection_and_add(triple.id, data);

                }

                else if (triple.predicate === "http://www.w3.org/2002/07/owl#oneOf") {

                    if (object.id.includes('_:')) {
                        //console.log("pass");
                    }
                    else {

                        data.push(
                            {
                                group: "nodes",
                                data: {
                                    id: triple.id,
                                    label: "oneOf",
                                    group: "oneOf"
                                }
                            },
                            {
                                group: "edges",
                                data: {id: Random.id(), source: object.id, target: triple.id}
                            }
                        );
                        //console.log(triple.id, object.id);
                        await get_collection_and_add(triple.id, data);
                    }

                }

                else if (triple.predicate === "http://www.w3.org/2002/07/owl#equivalentClass") {
                    data.push(
                        {
                            group: "edges",
                            data: {id: Random.id(), source: object.id, target: triple.id},
                            style: {label: "equivalentClass"}
                        }
                    );
                }

                else if (triple.predicate === "http://www.w3.org/2002/07/owl#equivalentProperty") {
                    data.push(
                        {
                            group: "edges",
                            data: {id: Random.id(), source: object.id, target: triple.id},
                            style: {label: "equivalentProperty"}
                        }
                    );
                }

                else if (triple.predicate === "http://www.w3.org/2002/07/owl#disjointWith") {
                    data.push(
                        {
                            group: "edges",
                            data: {id: Random.id(), source: object.id, target: triple.id,},
                            style: {label: "disjointWith"}
                        }
                    );
                }

                else if (triple.predicate === "http://www.w3.org/2002/07/owl#complementOf") {
                    data.push(
                        {
                            group: "edges",
                            data: {id: Random.id(), source: object.id, target: triple.id},
                            style: {label: "complementOf"}
                        }
                    );
                }

                else if (triple.predicate === "http://www.w3.org/2002/07/owl#inverseOf") {
                    data.push(
                        {
                            group: "edges",
                            data: {id: Random.id(), source: object.id, target: triple.id},
                            style: {label: "inverseOf"}
                        }
                    );
                }


                else {
                    // pass
                }

            }
        } //Edge Adding*!/*/
        resolve(data);


    });
}


function get_triples(ns) {
    return new Promise(function (resolve, reject) {
        Meteor.call('get_subjects_and_their_predicates', ns, function (err, res) {
            if (res) {
                resolve(res);
            }
            else
                reject("err");
        });
    })
}


function get_collection_and_add(id, data) {
    return new Promise(function (resolve, reject) {
        Meteor.call('get_list', id, function (err, res) {
            if (res) {

                res.forEach(function (list_element) {

                    if (list_element.type === "http://www.w3.org/1999/02/22-rdf-syntax-ns#first") {

                        data.push(
                            {
                                group: "edges",
                                data: {id: Random.id(), source: id, target: list_element.id, group: "list"}
                            }
                        );

                    }
                });
                resolve("intersection add");
            }
            else
                reject("err");
        });
    })
}

function get_collection(id) {
    return new Promise(function (resolve, reject) {
        Meteor.call('get_list', id, true, function (err, res) {
            if (res) {
                resolve(res)
            }
            else {
                reject(err);
            }
        });
    })
}


function get_ind_num() {
    return new Promise(function (resolve, reject) {
        Meteor.call('get_individual_num', function (err, res) {
            if (res) {
                console.log(res);
                resolve(res);
            }
            else {
                console.log(err);
            }
        });
    })
}

function get_fullness(id) {
    return new Promise(async function (resolve, reject) {
        Meteor.call('get_fullness', id, function (err, res) {
            if (res) {
                resolve(res);
            }
            else
                reject("err");
        });
    })
}


export function filter(cy, filter_type, checked) {
    let eles;
    if (filter_type.indexOf("node") >= 0)
        eles = cy.elements(filter_type);
    else {
        eles = cy.edges(filter_type).connectedNodes();
    }


    if (checked) {
        cy.nodes(eles).style("display", "none");

    }
    else {
        cy.nodes(eles).style("display", "element");
    }

    var ly = cy.layout(defaults);
    ly.run();
    //hiyerarşik gösterim eklenebilir subclass icin
    //animasyon eklenebilir
}


export function ShowClassHierarchy(cy) {
    let ele = cy.edges('edge[group="subclass"]');
    let eles = ele.connectedNodes();
    cy.nodes('node[group="restriction"]').addClass('pitfall');
    cy.nodes().difference(eles).style("display", "none");

    cy.animation({
        fit: {
            eles: eles
        }
    }).play();

}


function get_kce() {
    return new Promise(async function (resolve, reject) {
        console.time("kce execution time");
        Meteor.call('get_kce', cookies.get('namespace'), function (err, res) {
            if(res){
                console.timeEnd("kce execution time");
                console.log("kce result" + res);
                resolve(res);
            }
            else
                console.log(err);
        })
    });
}

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