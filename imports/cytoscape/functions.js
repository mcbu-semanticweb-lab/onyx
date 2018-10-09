import OPTIONS from "./colajs-options";
import {Random} from 'meteor/random';
import tippy from 'tippy.js';

var list = [];

export function showNeighborhoods(id, cy) {
    ele = cy.getElementById(id);
    eles = ele.neighborhood();
    cy.nodes().difference(eles).style("display","none");
    ele.style("display","element");
    cy.animation({
        fit : {
            eles : eles
        }
    }).play();

}

export function showRestrictions(id, cy) {

    Meteor.call('find_attributes_restriction', id, function (err, res) {

        if (res) {
            res.forEach(function (triple) {
                console.log(res);

                if (triple.predicate === "http://www.w3.org/2002/07/owl#onProperty" || triple.predicate === "http://www.w3.org/2002/07/owl#hasValue") {

                    console.log(triple.object);

                    cy.add([
                        {
                            group: "nodes",
                            data: {
                                id: triple.object,
                                label: triple.object,
                                group: "object_property"
                            }
                        },
                    ]);


                    cy.add([
                        {
                            group: "edges",
                            data: {
                                id: Random.id(),
                                source: triple.subject,
                                target: triple.object,
                            },
                            style: {
                                label: triple.predicate,
                            }
                        }
                    ]);


                }

                else {
                    //pass
                }
            });

            let ele = cy.getElementById(id);
            let eles = ele.neighborhood();
            let eles2 = eles.neighborhood();
            cy.nodes().difference(eles,eles2).style("display", "none");
            ele.style("display", "element");
            // cy.animation({
            //     center: {
            //         eles: eles
            //     }
            // }).play();

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

    let data = [];

    // await Promise.all([nodeAdd(data),edgeAdd(data)]);
    // return callback(data);

    let pro1 = nodeAdd(data);
    let pro2 = edgeAdd(data);
    Promise.all([pro1, pro2]).then(function (result) {
        return callback(data);
    });


}


function nodeAdd(data) {
    return new Promise(function (resolve, reject) {
        Meteor.call('get_subjects_and_their_predicates', function (err, res) {

            if (err)
                reject(err);

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

                console.log("node adding completed");
                resolve("node adding completed");
            }
        });
    });
};

function edgeAdd(data) {
    return new Promise(function (resolve, reject) {
        Meteor.call('get_subjects_and_their_predicates', async function (err, res) {
            if (err)
                reject(err);

            if (res) {
                for (object of res) {
                    for (let triple of object.predicates) {
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

                        else if (triple.predicate === "http://www.w3.org/2002/07/owl#intersectionOf") {


                            //intersection of kutusu eklenecek


                            data.push(
                                {
                                    group: "nodes",
                                    data: {
                                        id: triple.id,
                                        label: "N",
                                        group: "intersectionOf"
                                    }
                                },
                                {
                                    group: "edges",
                                    data: {id: Random.id(), source: object.id, target: triple.id }
                                }
                            );

                            await get_list(triple.id, data);


                            //collection alınıp first ler eklenecek(node adding e gönderilecek)
                        }

                        else {
                            // pass
                        }

                    }
                    ;
                }
                ; //Edge Adding*!/*/
                console.log("edge adding completed");
                resolve("edge adding completed");
            }

        });
    });
}


function get_list(id, data) {
    return new Promise(function (resolve, reject) {
        Meteor.call('get_list', id, function (err, res) {
            if (res) {

                res.forEach(function (list_element) {

                    if (list_element.type === "http://www.w3.org/1999/02/22-rdf-syntax-ns#first") {

                        data.push(
                            {
                                group: "edges",
                                data: {id: Random.id(), source: id, target:list_element.id}
                            }
                        );

                    }
                });
                resolve("intersection add");
            }
            else
                return reject("err");
        });
    })

}


function extra_add(node, data) {

    console.log(node.id);
    if (node.type === "http://www.w3.org/1999/02/22-rdf-syntax-ns#first") {

        data.push(
            {
                group: "nodes",
                data: {
                    id: node.id,
                    label: node.id,
                    group: "class"
                }
            }
        );

    }


}


function find_domain(obj) {
    return obj.predicate === "http://www.w3.org/2000/01/rdf-schema#domain";
}

function find_range(obj) {
    return obj.predicate === "http://www.w3.org/2000/01/rdf-schema#range";
}

export function filter(cy, filter_type, checked) {
    let ele = cy.edges('edge[group="' + filter_type + '"]');
    let eles = ele.connectedNodes();
    if (checked) {
        cy.nodes().difference(eles).style("display", "none");

    }
    else {
        cy.nodes().difference(eles).style("display", "element");
    }
    //hiyerarşik gösterim eklenebilir
    //animasyon eklenebilir
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