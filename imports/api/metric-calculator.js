import {HTTP} from "meteor/http";
import {Meteor} from "meteor/meteor";

/*
"http://www.w3.org/2000/01/rdf-schema#range"
"http://www.w3.org/2000/01/rdf-schema#domain"
"http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
"http://www.w3.org/2000/01/rdf-schema#subClassOf"
"http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
"http://www.w3.org/2000/01/rdf-schema#label"
"http://www.w3.org/2000/01/rdf-schema#comment"
"http://www.w3.org/2000/01/rdf-schema#seeAlso"
"http://www.w3.org/2000/01/rdf-schema#isDefinedBy"
 */

/*var p = g.V().Out("<http://www.w3.org/2000/01/rdf-schema#range>").Count()

var p1 = g.V().Out("<http://www.w3.org/2000/01/rdf-schema#domain>").Count()

var p2 = g.V().Out("<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>").Count()

var p3 = g.V().Out("<http://www.w3.org/2000/01/rdf-schema#subClassOf>").Count()

var p4 = g.V().Out("<http://www.w3.org/2000/01/rdf-schema#subPropertyOf>").Count()

var p5 = g.V().Out("<http://www.w3.org/2000/01/rdf-schema#label>").Count()

var p6 = g.V().Out("<http://www.w3.org/2000/01/rdf-schema#comment>").Count()

var p7 = g.V().Out("<http://www.w3.org/2000/01/rdf-schema#seeAlso>").Count()

var p8 = g.V().Out("<http://www.w3.org/2000/01/rdf-schema#isDefinedBy>").Count()

g.Emit(p+p1+p2+p3+p4+p5+p6+p7+p8)

var class1 = g.V("<http://www.w3.org/2000/01/rdf-schema#Class>").Tag("<object>").In("<http://www.w3.org/1999/02/22-rdf-syntax-ns#type","predicate>")

var class2 = g.V("<http://www.w3.org/2002/07/owl#Class>").Tag("<object>").In("<http://www.w3.org/1999/02/22-rdf-syntax-ns#type","predicate>")

var m = class1.Union(class2).Unique().Count()

g.Emit(m)

*/

Meteor.methods({
    class_number : function () {
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync('http://localhost:64210/api/v1/query/gizmo',
            {
                content :'var class1 = g.V("<http://www.w3.org/2000/01/rdf-schema#Class>").In("<<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>","predicate")\n' +
                '\n' +
                'var class2 = g.V("<http://www.w3.org/2002/07/owl#Class>").In("<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>","predicate")\n' +
                '\n' +
                'var m = class1.Union(class2).Unique().Count()\n' +
                '\n' +
                'g.Emit(m)'
            });
        return(JSON.parse(result.content).result[0]);
    },

    class_name : function () {
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync('http://localhost:64210/api/v1/query/gizmo',
            {
                content :'var class1 = g.V("<http://www.w3.org/2000/01/rdf-schema#Class>").In("<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>")\n' +
                'var class2 = g.V("<http://www.w3.org/2002/07/owl#Class>").In("<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>")\n' +
                '\n' +
                'var m = class1.Union(class2).Unique().All()\n' +
                '\n' +
                'g.Emit(m)'
            });
        return(JSON.parse(result.content).result);
    },

    property_number : function (class_name) {
        if(class_name === undefined){
            let sync = Meteor.wrapAsync(HTTP.post);
            let result = sync('http://localhost:64210/api/v1/query/gizmo',
                {
                    content : 'var p = g.V().Out("<http://www.w3.org/2000/01/rdf-schema#range>").Count()\n' +
                    '\n' +
                    'var p1 = g.V().Out("<http://www.w3.org/2000/01/rdf-schema#domain>").Count()\n' +
                    '\n' +
                    'var p2 = g.V().Out("<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>").Count()\n' +
                    '\n' +
                    'var p3 = g.V().Out("<http://www.w3.org/2000/01/rdf-schema#subClassOf>").Count()\n' +
                    '\n' +
                    'var p4 = g.V().Out("<http://www.w3.org/2000/01/rdf-schema#subPropertyOf>").Count()\n' +
                    '\n' +
                    'var p5 = g.V().Out("<http://www.w3.org/2000/01/rdf-schema#label>").Count()\n' +
                    '\n' +
                    'var p6 = g.V().Out("<http://www.w3.org/2000/01/rdf-schema#comment>").Count()\n' +
                    '\n' +
                    'var p7 = g.V().Out("<http://www.w3.org/2000/01/rdf-schema#seeAlso>").Count()\n' +
                    '\n' +
                    'var p8 = g.V().Out("<http://www.w3.org/2000/01/rdf-schema#isDefinedBy>").Count()\n' +
                    '\n' +
                    'g.Emit(p+p1+p2+p3+p4+p5+p6+p7+p8)'
                });
            return(JSON.parse(result.content).result[0]);
        }
        else {
            let sync = Meteor.wrapAsync(HTTP.post);
            let result = sync('http://localhost:64210/api/v1/query/gizmo',
                {
                    content : 'var p = g.V('+class_name+').Out("<http://www.w3.org/2000/01/rdf-schema#range>").Count()\n' +
                    '\n' +
                    'var p1 = g.V('+class_name+').Out("<http://www.w3.org/2000/01/rdf-schema#domain>").Count()\n' +
                    '\n' +
                    'var p2 = g.V('+class_name+').Out("<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>").Count()\n' +
                    '\n' +
                    'var p3 = g.V('+class_name+').Out("<http://www.w3.org/2000/01/rdf-schema#subClassOf>").Count()\n' +
                    '\n' +
                    'var p4 = g.V('+class_name+').Out("<http://www.w3.org/2000/01/rdf-schema#subPropertyOf>").Count()\n' +
                    '\n' +
                    'var p5 = g.V('+class_name+').Out("<http://www.w3.org/2000/01/rdf-schema#label>").Count()\n' +
                    '\n' +
                    'var p6 = g.V('+class_name+').Out("<http://www.w3.org/2000/01/rdf-schema#comment>").Count()\n' +
                    '\n' +
                    'var p7 = g.V('+class_name+').Out("<http://www.w3.org/2000/01/rdf-schema#seeAlso>").Count()\n' +
                    '\n' +
                    'var p8 = g.V('+class_name+').Out("<http://www.w3.org/2000/01/rdf-schema#isDefinedBy>").Count()\n' +
                    '\n' +
                    'g.Emit(p+p1+p2+p3+p4+p5+p6+p7+p8)'
                });
            return(JSON.parse(result.content).result[0]);
        }
    },
    
    instance_number : function (class_name) {
        if(class_name === undefined){
            let sync = Meteor.wrapAsync(HTTP.post);
            let result = sync('http://localhost:64210/api/v1/query/gizmo',
                {
                    content : 'var m = g.V().Out("<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>").Count()\n' +
                    '\n' +
                    'g.Emit(m);'
                });
            return(JSON.parse(result.content).result[0]);
        }
        else {
            let sync = Meteor.wrapAsync(HTTP.post);
            let result = sync('http://localhost:64210/api/v1/query/gizmo',
                {
                    content : 'var m = g.V().Out("<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>").Is("<'+class_name+'>").Count()\n' +
                    '\n' +
                    'g.Emit(m);'
                });
            return(JSON.parse(result.content).result[0]);
        }
    },

    class_utilization : function () {
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync('http://localhost:64210/api/v1/query/gizmo',
            {
                content : 'var n = g.V().Out("<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>").Unique().Count();\n' +
                '\n' +
                'var class1 = g.V("<http://www.w3.org/2000/01/rdf-schema#Class>").In("<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>","predicate")\n' +
                '\n' +
                'var class2 = g.V("<http://www.w3.org/2002/07/owl#Class>").In("<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>","predicate")\n' +
                '\n' +
                'var m = class1.Union(class2).Unique().Count()\n' +
                '\n' +
                'g.Emit(n/m);'
            });
        return(JSON.parse(result.content).result[0]);
    },
});