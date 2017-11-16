import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http'

let N3 = require('n3');
let parser = N3.Parser();
let Future = Npm.require( 'fibers/future' );

Meteor.methods({
    parse_and_send_to_cayley : function (url) {
        let future = new Future;
        HTTP.get(url,[],function(err,res){
                if(res){
                    let x = parser.parse(res.content);
                    x.forEach(function (res) {
                        HTTP.post('http://localhost:64210/api/v1/write',{
                            content:JSON.stringify([{
                                "subject": res.subject,
                                "predicate": res.predicate,
                                "object": res.object
                            }])
                        });
                    });
                    future.return("ready to visualize")
                }
                else{
                    //    console.log(err);
                }
            });
        return future.wait();
    },

    get_triples : function () {
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync('http://localhost:64210/api/v1/query/gremlin',
            {
                content : 'g.V().Tag("subject").Out(null, "predicate").Tag("object").All()'
            });
        return(JSON.parse(result.content).result);
    },

    get_domains_for_visualize : function () {
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync('http://localhost:64210/api/v1/query/gremlin',
            {
                content : 'g.V().Tag("subject").Out("http://www.w3.org/2000/01/rdf-schema#domain", "predicate").Tag("object").All()'
            });
        return(JSON.parse(result.content).result);
    },

    get_ranges_for_visualize : function () {
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync('http://localhost:64210/api/v1/query/gremlin',
            {
                content : 'g.V().Tag("subject").Out("http://www.w3.org/2000/01/rdf-schema#range", "predicate").Tag("object").All()'
            });
        return(JSON.parse(result.content).result);
    },

    remove_triples : function () {
        let future = new Future;
        HTTP.post('http://localhost:64210/api/v1/query/gremlin',
            {
                content : 'g.V().Tag("subject").Out(null, "predicate").Tag("object").All()'
            } , function (err,res) {
            let x = JSON.parse(res.content);
                x.result.forEach(function (res) {
                    HTTP.post('http://localhost:64210/api/v1/delete',{
                        content:JSON.stringify([{
                            "subject": res.subject,
                            "predicate": res.predicate,
                            "object": res.object
                        }])
                    });
                });
            future.return("removed all triples")
            });
        return future.wait();
    },

    count_triples : function () {
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync('http://localhost:64210/api/v1/query/gremlin',
            {
                content : 'g.V().Out(null).Count().All()'
            });
        return(JSON.parse(result.content).result[0].id);
    },
    
    find_attributes : function (id) {
        let triples = [];
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync('http://localhost:64210/api/v1/query/gremlin',
            {
                content : 'g.V("'+id+'").Tag("subject").Out(null, "predicate").Tag("object").All()'
            });
        atts = JSON.parse(result.content).result;
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
    }
});



