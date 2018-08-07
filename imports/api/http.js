import {Meteor} from 'meteor/meteor';
import {HTTP} from 'meteor/http'
import {ontology_data} from "./data";
import {check} from 'meteor/check'
let Future = Npm.require('fibers/future');

var N3 = require('n3');
var parser = N3.Parser();

Meteor.methods({
    parse_and_send_to_cayley: function (url) {
        let future = new Future;
        check(url, String);
        Meteor.call('rdf_translator', url, function (err, res) { //TODO: Parametre geçmiyor
            if (res) {
                let x = parser.parse(res);

                console.log("rdf translate completed");
                x.forEach(function (triple) {
                    if (triple.object.contains('@'))
                        triple.object = triple.object.slice(triple.object.lastIndexOf('@'));
                    HTTP.post('http://localhost:64210/api/v2/write', {
                        data: [{
                            "subject": triple.subject,
                            "predicate": triple.predicate,
                            "object": triple.object
                        }]
                    });
                });
                future.return("triples parsed and sended to cayley");
            }
            else {
                console.log(err);
            }
        });
        return future.wait();
    },

    send_to_cayley: function (data) {
        let x = parser.parse(data);
        console.log("parse completed");

        x.forEach(function (triple) {
             if (triple.object.includes('@')) // NamedNode İçin çözüm bul, eski parse tekniği?
                 triple.object = triple.object.slice(triple.object.lastIndexOf('@'));
            HTTP.post('http://localhost:64210/api/v2/write', {
                data: [{
                    "subject": triple.subject,
                    "predicate": triple.predicate,
                    "object": triple.object
                }]
            });
        });
        return(1);
    },


    get_triples: function () {
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync('http://localhost:64210/api/v2/query',
            {
                params: {
                    "lang": "gizmo"
                },
                content: 'g.V().Tag("subject").Out(null,"predicate").Tag("object").All()'
            });
        return (JSON.parse(result.content).result);
    },


    remove_triples: function () {
        let future = new Future;
        ontology_data.remove({});
        HTTP.post('http://localhost:64210/api/v2/query',
            {
                params: {
                    "lang": "gizmo"
                },
                content: 'g.V().Tag("subject").Out(null, "predicate").Tag("object").All()'
            }, function (err, res) {
                let x = JSON.parse(res.content);
                x.result.forEach(function (res) {
                    HTTP.post('http://localhost:64210/api/v2/delete', {  //TODO: ttl silme işlemi arkasında triple bırakıyor
                        data: [{
                            "subject": res.subject,
                            "predicate": res.predicate,
                            "object": res.object
                        }]
                    }, function (err, res) {
                        console.log(err, res);
                    });
                });
                future.return("removed all triples")
            });
        return future.wait();
    },

    count_triples: function () {
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync('http://localhost:64210/api/v2/query',
            {
                params: {
                    "lang": "gizmo"
                },
                content: 'var n = g.V().Out().Count();\n' +
                'g.Emit(n);'
            });
        return (JSON.parse(result.content).result[0]);
    },

    find_attributes: function (id) {
        let triples = [];
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync('http://localhost:64210/api/v2/query',
            {
                params: {
                    "lang": "gizmo"
                },
                content: 'g.V("' + id + '").Tag("subject").Out(null, "predicate").Tag("object").All()'
            });
        let atts = JSON.parse(result.content).result;
        if (atts === null)
            return null;
        atts.forEach(function (res) {
            if (res.predicate.includes('#')) {
                triples.push(
                    {
                        subject: res.subject,
                        predicate: res.predicate.split("#")[1],
                        object: res.object
                    }
                )
            }
        });
        return (triples);
    },

    find_attributes_restriction: function (id) {
        let triples = [];
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync('http://localhost:64210/api/v2/query',
            {
                params: {
                    "lang": "gizmo"
                },
                content: 'g.V("' + id + '").Tag("subject").Out(null, "predicate").Tag("object").All()'
            });
        let atts = JSON.parse(result.content).result;
        if (atts === null)
            return null;
        atts.forEach(function (res) {
            triples.push(
                {
                    subject: res.subject,
                    predicate: res.predicate.split("#")[1],
                    object: res.object
                }
            )
        });
        return (triples);
    },


    get_subjects_and_their_predicates: function () {
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync('http://localhost:64210/api/v1/query/gizmo?limit=-1',
            {
                content: 'g.V().In().Unique().ForEach( function(d) {\n' +
                '\n' +
                '    d.predicates = g.V(d.id).Out(null,"predicate").Tag("object").TagArray()\n' +
                '\n' +
                '    g.Emit(d)\n' +
                '\n' +
                '})'
            });
        return (JSON.parse(result.content).result);
    },

    get_individual_num: function (id) {
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync('http://localhost:64210/api/v1/query/gizmo?limit=100000000',
            {
                content: 'var a =  g.V("' + id + '").In("http://www.w3.org/1999/02/22-rdf-syntax-ns#type").Count()    \n' +
                'g.Emit(a)\n' +
                '\t\t\n' +
                '\n'
            });
        return (JSON.parse(result.content).result);
    },


    get_subclasses: function (id) {
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync('http://localhost:64210/api/v1/query/gizmo?limit=1000000',
            {
                content: 'g.V("' + id + '").In("http://www.w3.org/2000/01/rdf-schema#subClassOf").All()    \n' +
                '\t\t\n' +
                '\n'
            });
        return (JSON.parse(result.content).result);
    },

    get_list: function (id) {
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync('http://localhost:64210/api/v1/query/gizmo?limit=1000000',
            {
                content: '\n' +
                '    var list = {};\n' +
                '\n' +
                'list.first = g.V("' + id + '").Out("<http://www.w3.org/1999/02/22-rdf-syntax-ns#first>").TagValue("first")\n' +
                '\n' +
                'list.rest = g.V("' + id + '").Out("<http://www.w3.org/1999/02/22-rdf-syntax-ns#rest>").TagValue("rest")\n' +
                '\n' +
                'g.Emit(list)\n'
            });
        return (JSON.parse(result.content).result);
    },


});







