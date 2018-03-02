import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http'
import { ontology_data} from "./data";

let Future = Npm.require( 'fibers/future' );

var N3 = require('n3');
var parser = N3.Parser();

Meteor.methods({
    parse_and_send_to_cayley : function (url) {
        let future = new Future;
        Meteor.call('rdf_translator',url,function (err,res) {
            if(res){
                let x = parser.parse(res);
                console.log("rdf translate completed");
                x.forEach(function (triple) {
                    if(triple.object.includes('@'))
                        triple.object = triple.object.slice(triple.object.lastIndexOf('@'));
                    HTTP.post('http://localhost:64210/api/v2/write',{
                        data:[{
                            "subject": triple.subject,
                            "predicate": triple.predicate,
                            "object": triple.object
                        }]
                    });
                });
                future.return("triples parsed and sended to cayley");
            }
        });
        return future.wait();
    },

    get_base : function () {
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync('http://localhost:64210/api/v2/query/gizmo',
            {
                params : {
                  "lang" : "gizmo"
                },
                content : 'g.V().Tag("base").Out("http://www.w3.org/1999/02/22-rdf-syntax-ns#type").Is("http://www.w3.org/2002/07/owl#Ontology").All()'
            });
        return(JSON.parse(result.content).result[0].base);
    },



    get_triples : function () {
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync('http://localhost:64210/api/v2/query',
            {
                params : {
                    "lang" : "gizmo"
                },
                content : 'g.V().Tag("subject").Out(null,"predicate").Tag("object").All()'
            });
        return(JSON.parse(result.content).result);
    },

    get_domains_for_visualize : function () {
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync('http://localhost:64210/api/v2/query',
            {
                params : {
                    "lang" : "gizmo"
                },
                content : 'g.V().Tag("subject").Out("http://www.w3.org/2000/01/rdf-schema#domain", "predicate").Tag("object").All()'
            });
        return(JSON.parse(result.content).result);
    },

    get_ranges_for_visualize : function () {
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync('http://localhost:64210/api/v2/query',
            {
                params : {
                    "lang" : "gizmo"
                },
                content : 'g.V().Tag("subject").Out("http://www.w3.org/2000/01/rdf-schema#range", "predicate").Tag("object").All()'
            });
        return(JSON.parse(result.content).result);
    },

    remove_triples : function () {
        let future = new Future;
        ontology_data.remove({});
        HTTP.post('http://localhost:64210/api/v2/query',
            {
                params : {
                    "lang" : "gizmo"
                },
                content : 'g.V().Tag("subject").Out(null, "predicate").Tag("object").All()'
            } , function (err,res) {
            let x = JSON.parse(res.content);
                x.result.forEach(function (res) {
                    HTTP.post('http://localhost:64210/api/v2/delete',{  //TODO: ttl silme işlemi arkasında triple bırakıyor
                        data:[{
                            "subject": res.subject,
                            "predicate": res.predicate,
                            "object": res.object
                        }]
                    },function (err,res) {
                        console.log(err,res);
                    });
                });
            future.return("removed all triples")
            });
        return future.wait();
    },

    count_triples : function () {
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync('http://localhost:64210/api/v2/query',
            {
                params : {
                    "lang" : "gizmo"
                },
                content : 'var n = g.V().Out().Count();\n' +
                'g.Emit(n);'
            });
        return(JSON.parse(result.content).result[0]);
    },
    
    find_attributes : function (id) {
        let triples = [];
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync('http://localhost:64210/api/v2/query',
            {
                params : {
                    "lang" : "gizmo"
                },
                content : 'g.V("'+id+'").Tag("subject").Out(null, "predicate").Tag("object").All()'
            });
        let atts = JSON.parse(result.content).result;
        if(atts===null)
            return null;
        atts.forEach(function (res) {
            if(res.predicate.includes('#')){
                triples.push(
                    {
                        subject : res.subject,
                        predicate : res.predicate.split("#")[1],
                        object: res.object
                    }
                )
            }
        });
        return(triples);
    },

    get_triples_by_type : function () {
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync('http://localhost:64210/api/v2/query',
            {
                params : {
                    "lang" : "gizmo"
                },
                content : 'g.V().Tag("subject").Out("http://www.w3.org/1999/02/22-rdf-syntax-ns#type","predicate").Tag("object").All()'
            });
        return(JSON.parse(result.content).result);
    },
});



