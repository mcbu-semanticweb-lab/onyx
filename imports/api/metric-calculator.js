import {HTTP} from "meteor/http";
import {Meteor} from "meteor/meteor";


Meteor.methods({
    class_utilization : function () {
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync('http://localhost:64210/api/v1/query/gizmo',
            {
                content : 'var n = g.V().Out("http://www.w3.org/1999/02/22-rdf-syntax-ns#type").Unique().Count();\n' +
                '\n' +
                'var class1 = g.V().Out(null,"predicate").Is("http://www.w3.org/2002/07/owl#Class")\n' +
                '\n' +
                'var class2 = g.V().Out(null,"predicate").Is("http://www.w3.org/2000/01/rdf-schema#Class")\n' +
                '\n' +
                'var m = class1.Union(class2).In().Unique().Count()\n' +
                '                \n' +
                'g.Emit(n/m);'
            });
        return(JSON.parse(result.content).result[0]);
    },
});