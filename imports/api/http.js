import {Meteor} from 'meteor/meteor';
import {HTTP} from 'meteor/http'
import {ontology_data} from "./data";
import {check} from 'meteor/check'
import { Session } from 'meteor/session'
let Future = Npm.require('fibers/future');
var exec = Npm.require("child_process").exec;

var N3 = require('n3');
var parser = N3.Parser();

import  { CAYLEY_URL } from '../../server/main';

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
                    HTTP.post(CAYLEY_URL + 'api/v2/write', {
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
        console.time("data parse");
        let ns;
        let x = parser.parse(data);
        for(var i = 0; i < x.length; i++)
        {
            if(x[i].object == 'http://www.w3.org/2002/07/owl#Ontology')
            {
                ns = x[i].subject;
                break;
            }
        }
        console.log("namespace is " + ns);
        if(check_ns(ns)===true){
            console.log("already added");
            return (ns);
        }

        console.timeEnd("data parse");
        console.time("send cayley");
        x.forEach(function (triple) {
            if (triple.object.includes('@')) // NamedNode İçin çözüm bul, eski parse tekniği?
                triple.object = triple.object.slice(triple.object.lastIndexOf('@'));
            //if(triple.predicate === )
            HTTP.post(CAYLEY_URL + 'api/v2/write', {
                data: [{
                    "subject": triple.subject,
                    "predicate": triple.predicate,
                    "object": triple.object,
                    "label" : ns
                }]
            });
        });
        console.timeEnd("send cayley");
        return (ns);
    },




    get_kce: function (ns) {
        let future = new Future;
        var command = "cd /kce && java -Xmx2G -cp .:facility.jar:kce.jar:owlapi-bin.jar:taxonomy.jar:taxonomy-makers.jar test " + ns;
        console.log(command);
        exec(command, function (error, stdout, stderr) {
            if (error) {
                console.log(error);
                throw new Meteor.Error(500, command + " failed");
            }
            future.return(
                stdout.substring(stdout.lastIndexOf("[") + 1, stdout.lastIndexOf("]")).split(', ')
            );
        });
        return future.wait();
    },

    get_triples: function () {
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync(CAYLEY_URL + 'api/v2/query',
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
        HTTP.post(CAYLEY_URL + 'api/v2/query',
            {
                params: {
                    "lang": "gizmo"
                },
                content: 'g.V().Tag("subject").Out(null, "predicate").Tag("object").All()'
            }, function (err, res) {
                let x = JSON.parse(res.content);
                x.result.forEach(function (res) {
                    HTTP.post(CAYLEY_URL + 'api/v2/delete', {  //TODO: ttl silme işlemi arkasında triple bırakıyor
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
        let result = sync(CAYLEY_URL + 'api/v2/query',
            {
                params: {
                    "lang": "gizmo"
                },
                content: 'var n = g.V().Out().Count();\n' +
                    'g.Emit(n);'
            });
        return (JSON.parse(result.content).result[0]);
    },

    find_attributes: function (id, type) {
        let triples = [];
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync(CAYLEY_URL + 'api/v2/query',
            {
                params: {
                    "lang": "gizmo"
                },
                content: 'g.V("' + id + '").Tag("subject").Out(null, "predicate").Tag("object").All()'
            });

        if (type === "info") {
            console.log("info");
            let atts = JSON.parse(result.content).result;
            if (atts === null)
                return null;
            else
                return (atts);
        }
        else {
            return JSON.parse(result.content).result;
        }
    },

    get_subjects_and_their_predicates: function (ns) {
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync(CAYLEY_URL + 'api/v1/query/gizmo?limit=-1',
            {
                content: 'g.V().LabelContext("'+ns+'").In().Unique().ForEach( function(d) {\n' +
                    '\n' +
                    '    d.predicates = g.V(d.id).Out(null,"predicate").Tag("object").TagArray()\n' +
                    '\n' +
                    '    g.Emit(d)\n' +
                    '\n' +
                    '})'
            });
        return (JSON.parse(result.content).result);
    },

    get_individual_num: function (id,ns) {
        let sync = Meteor.wrapAsync(HTTP.post);
        let result;
        if (id !== null) {
            console.log(id);
             result =sync(CAYLEY_URL + 'api/v1/query/gizmo?limit=-1',
                {
                    content: 'var a = g.V("'+id+'").Tag("ind").Out("http://www.w3.org/1999/02/22-rdf-syntax-ns#type").Has("http://www.w3.org/1999/02/22-rdf-syntax-ns#type","http://www.w3.org/2002/07/owl#Class","http://www.w3.org/2000/01/rdf-schema#Class").Count()    \n' +
                        'g.Emit(a)\n' +
                        '\t\t\n' +
                        '\n'
                });
        }
        else {
            result = sync(CAYLEY_URL + 'api/v1/query/gizmo?limit=-1',
                {
                    content: 'var a = g.V().Tag("ind").LabelContext("'+ns+'").Out("http://www.w3.org/1999/02/22-rdf-syntax-ns#type").Has("http://www.w3.org/1999/02/22-rdf-syntax-ns#type","http://www.w3.org/2002/07/owl#Class","http://www.w3.org/2000/01/rdf-schema#Class").Count()    \n' +
                        'g.Emit(a)\n' +
                        '\t\t\n' +
                        '\n'
                });
            if (JSON.parse(result.content).result[0] === 0)
                return ("zero");

        }



        return (JSON.parse(result.content).result[0]);
        // get ind -> g.V().Tag("ind").Out("http://www.w3.org/1999/02/22-rdf-syntax-ns#type").Has("http://www.w3.org/1999/02/22-rdf-syntax-ns#type","http://www.w3.org/2002/07/owl#Class").All()
        // TODO : query limit fix
        // TODO : rdf class control
    },

    get_fullness: function (id) {
        // get ind -> g.V().Tag("ind").Out("http://www.w3.org/1999/02/22-rdf-syntax-ns#type").Has("http://www.w3.org/1999/02/22-rdf-syntax-ns#type","http://www.w3.org/2002/07/owl#Class").All()
        // TODO : query limit fix
        // TODO : rdf class control
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync(CAYLEY_URL + 'api/v1/query/gizmo?limit=100000000',
            {
                content: 'var ind = g.V().Tag("ind").Out("http://www.w3.org/1999/02/22-rdf-syntax-ns#type").Has("http://www.w3.org/1999/02/22-rdf-syntax-ns#type","http://www.w3.org/2002/07/owl#Class").Is("' + id + '").Count() \n' +
                    '\n' +
                    'var sub_max = 0;\n' +
                    '\n' +
                    'g.V().Has("http://www.w3.org/2000/01/rdf-schema#subClassOf","' + id + '").ForEach(function(res){\n' +
                    '      \n' +
                    '  var current = g.V().Tag("ind").Out("http://www.w3.org/1999/02/22-rdf-syntax-ns#type").Has("http://www.w3.org/1999/02/22-rdf-syntax-ns#type","http://www.w3.org/2002/07/owl#Class","http://www.w3.org/2000/01/rdf-schema#Class").Is(res.id).Count()  \n' +
                    '  if(current > sub_max){\n' +
                    '    sub_max = current;\n' +
                    '  }\n' +
                    '})\n' +
                    '\n' +
                    'g.Emit(ind+sub_max)'
            });
        return (JSON.parse(result.content).result);
    },


    get_list: function (id, restriction) {
        let sync = Meteor.wrapAsync(HTTP.post);
        let query;
        if (restriction) {
            query = 'var f_r = g.M().Out(["http://www.w3.org/1999/02/22-rdf-syntax-ns#first","http://www.w3.org/1999/02/22-rdf-syntax-ns#rest"],"type");\n' +
                'g.V("' + id + '").Out("http://www.w3.org/2002/07/owl#oneOf").FollowRecursive(f_r).All()'
        }
        else {
            query = 'var f_r = g.M().Out(["http://www.w3.org/1999/02/22-rdf-syntax-ns#first","http://www.w3.org/1999/02/22-rdf-syntax-ns#rest"],"type");\n' +
                'g.V("' + id + '").FollowRecursive(f_r).All()'
        }
        let result = sync(CAYLEY_URL + 'api/v1/query/gizmo?limit=1000000',
            {
                content: query
            });
        return (JSON.parse(result.content).result);
    },

    get_namespace: function () {
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync(CAYLEY_URL + 'api/v1/query/gizmo?limit=-1',
            {
                content: 'var ns = g.V().Has("http://www.w3.org/1999/02/22-rdf-syntax-ns#type","http://www.w3.org/2002/07/owl#Ontology").ToValue()\n' +
                    'g.Emit(ns)'
            });
        return (JSON.parse(result.content).result[0]);
    }


});


function check_ns(ns) {
    let sync = Meteor.wrapAsync(HTTP.post);
    let result = sync(CAYLEY_URL + 'api/v2/query',
        {
            params: {
                "lang": "gizmo"
            },
            content: 'var num = g.V().LabelContext("'+ns+'").In().Count()\n' +
                'g.Emit(num)'
        });
    console.log(JSON.parse(result.content).result[0] );
    return JSON.parse(result.content).result[0] !== 0;
}


