import { HTTP } from 'meteor/http';
import { Random } from 'meteor/random';
import { triples } from '../lib/collections';
import simple from './simplification';

Arr = [];
Arr2 = [];
let post;

function setquery(item) {
    return ` var a = _.uniq(g.V("`+item+`").OutPredicates().ToArray()) 
        g.Emit(a)`;
}

if(Meteor.isServer){

    if(triples.find({}).fetch().length===0) {

        console.log("data not found in collection");

        let classes = HTTP.call('POST', 'http://localhost:64210/api/v1/query/gremlin',
            {
                content: 'g.V(g.V().Out()).In().All()',
                headers: {
                    "Cache-Control": "no-store",
                    "Pragma": "no-cache",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS ",
                    "Access-Control-Allow-Header": "Content-Type, Authorization, X-Requested-With"
                }
            });

        _.each(JSON.parse(classes.content).result, function (item) {

            Arr.push(item.id);

        });


        _.each(_.uniq(Arr), function (item) { //tüm classlar

            let properties = HTTP.call('POST', 'http://localhost:64210/api/v1/query/gremlin',
                {
                    content: setquery(item),
                    headers: {
                        "Cache-Control": "no-store",
                        "Pragma": "no-cache",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS ",
                        "Access-Control-Allow-Header": "Content-Type, Authorization, X-Requested-With"
                    }
                });

            _.each(JSON.parse(properties.content).result, function (item2) {

                for (let i = 0; i < item2.length; i++) {
                    Arr2.push(item2[i]);

                }

                _.each(_.uniq(Arr2), function (item4) { //propertyler

                    let asd = HTTP.call('POST', 'http://localhost:64210/api/v1/query/gremlin',
                        {
                            content: 'g.V(' + JSON.stringify(item) + ').Out(' + JSON.stringify(item4) + ').All()',
                            headers: {
                                "Cache-Control": "no-store",
                                "Pragma": "no-cache",
                                "Access-Control-Allow-Origin": "*",
                                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS ",
                                "Access-Control-Allow-Header": "Content-Type, Authorization, X-Requested-With"
                            }
                        });

                    _.each(JSON.parse(asd.content).result, function (item3) {
                        if (item.split('/')[item.split('/').length - 1] === "") {
                            post = {
                                subject: item,
                                predicate: item4,
                                object: item3.id
                            };
                        }
                        else {
                            post = {
                                subject: simple(item),
                                predicate: simple(item4),
                                object: simple(item3.id)
                            };
                        }
                        if (!triples.findOne(post))
                            return triples.insert(post)
                    });
                });
            });
        });
    }
    else
        console.log("data found in collection");

console.log("data processes has completed");
}

