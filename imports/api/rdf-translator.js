import {Meteor} from "meteor/meteor";
import {HTTP} from "meteor/http";

Meteor.methods({
    rdf_translator: function (uri, data) {
        if (data === undefined) {
            let sync = Meteor.wrapAsync(HTTP.post);
            let result = sync('http://rdf-translator.appspot.com/convert/detect/nt/' + uri);
            return (result.content);
        }
        else {
            let sync = Meteor.wrapAsync(HTTP.post);
            let result = sync('http://rdf-translator.appspot.com/convert/detect/json-ld/content', {
                params : {
                    content : data
                }
            });
            return (result.content);
        }
    },
});